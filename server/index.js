require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const { Pool } = require('pg');

let dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
};


const pool = new Pool(dbConfig);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let client;
    try {
        client = await pool.connect(); 
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            console.log('login failed');
            return res.status(401).json({ errorMessage: 'Invalid username or password' });
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            console.log('login failed');
            return res.status(401).json({ errorMessage: 'Invalid username or password' });
        }
        const token = jwt.sign({ sub: user.user_id, username: user.username, isAdmin: user.user_admin }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });


        console.log('login successful, token generated');
        return res.json({ token: token, isAdmin: user.user_admin });
    } catch (err) {
        console.error('Error during login', err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
});

app.post('/createAccount', async (req, res) => {
    const { username, password, confirmPassword, email, firstName, lastName, userAdmin, phone } = req.body;
    let client;
    if (userAdmin === null) {
      userAdmin = false;
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ errorMessage: 'Passwords do not match' });
    }

    try {
        client = await pool.connect();
        const existingUser = await client.query('SELECT * FROM users WHERE username = $1 OR user_email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
          console.log('Username or email already exists');
          return res.status(400).json({ errorMessage: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query('INSERT INTO users (username, user_password, user_email, first_name, last_name, user_admin, user_phone, print_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [username, hashedPassword, email, firstName, lastName, userAdmin, phone, password]);
        console.log('account created');
        return res.json({ message: 'Account created' });
    } catch (err) {
        console.error('Error creating account', err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    } finally {
        if (client) {
            client.release();
        }
    }
});

app.get('/user/profile', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    const result = await client.query('SELECT first_name, last_name, user_email, user_phone FROM users WHERE username = $1', [decoded.username]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


app.put('/user/profile', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    await client.query('UPDATE users SET first_name = $1, last_name = $2, user_email = $3, user_phone = $4 WHERE username = $5', [firstName, lastName, email, phone, decoded.username]);
    client.release();
    const updatedData = {firstName, lastName, email, phone};
    res.status(200).json(updatedData);
    console.log('User profile updated successfully:', updatedData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});



app.get('/courses', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];  
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    if (decoded.isAdmin) {
      const result = await client.query('SELECT * FROM courses');
      client.release();
      res.status(200).json(result.rows);
    } else {
      const result = await client.query('SELECT * FROM courses WHERE string_id NOT IN (SELECT string_id FROM register WHERE user_id = $1)', [decoded.sub]);
      client.release();
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.put('/courses/registered', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const { cartItems } = req.body;
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('decoded:', decoded);
      const client = await pool.connect();
      try {
          await client.query('BEGIN');
          for (const item of cartItems) {
              const { rows } = await client.query(
                  'SELECT maximum_capacity FROM courses WHERE string_id = $1',
                  [item.string_id]
              );

              if (rows.length === 0 || rows[0].maximum_capacity <= 0) {
                  await client.query('ROLLBACK');
                  return res.status(400).json({ errorMessage: `Course ${item.string_id} is full` });
              }

              await client.query(
                  'INSERT INTO register (user_id, string_id) VALUES ($1, $2)',
                  [decoded.sub, item.string_id]
              );
              await client.query(
                  'UPDATE courses SET maximum_capacity = maximum_capacity - 1 WHERE string_id = $1 AND maximum_capacity > 0',
                  [item.string_id]
              );
              console.log(`${decoded.username} registered for course ${item.string_id}`);
          }
          await client.query('COMMIT');
          res.status(200).json({ message: 'Courses registered successfully' });
      } catch (error) {
          await client.query('ROLLBACK');
          throw error; 
      } finally {
          client.release();
      }
  } catch (error) {
      console.error('Error registering courses:', error);
      res.status(500).json({ errorMessage: 'Failed to register courses' });
  }
});



// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} Database_url: ${process.env.DATABASE_URL}`);
});
