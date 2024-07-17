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

        const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
        console.log('login successful, token generated');
        return res.json({ token: token });
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
        await client.query('INSERT INTO users (username, user_password, user_email, first_name, last_name, user_admin, user_phone) VALUES ($1, $2, $3, $4, $5, $6, $7)', [username, hashedPassword, email, firstName, lastName, userAdmin, phone]);
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



// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} Database_url: ${process.env.DATABASE_URL}`);
});
