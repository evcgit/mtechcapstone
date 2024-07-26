require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const { Pool } = require('pg');

const dbConfig = {
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
        const token = jwt.sign({ sub: user.user_id, username: user.username, isAdmin: user.user_admin, principal: user.master_admin }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '3h' });

        console.log('login successful, token generated');
        return res.json({ token: token, isAdmin: user.user_admin });
    } catch (err) {
        console.error('Error during login', err);
        return res.status(500).json({ errorMessage: 'Internal server error' });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

app.post('/createAccount', async (req, res) => {
    let { username, password, confirmPassword, email, firstName, lastName, userAdmin, phone } = req.body;
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
        await client.query('INSERT INTO users (username, user_password, user_email, first_name, last_name, user_admin, user_phone, master_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [username, hashedPassword, email, firstName, lastName, userAdmin, phone, false]);
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
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const client = await pool.connect();
        const result = await client.query('SELECT first_name, last_name, user_email, user_phone, user_admin FROM users WHERE username = $1', [decoded.username]);
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
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
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


app.put('/admin/edit/user', async (req, res) => {
	const { user_id, first_name, last_name, email, phone } = req.body;
	const token = req.headers['authorization'].split(' ')[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded.isAdmin) {
			return res.status(403).json({ errorMessage: 'Unauthorized' });
		}
		const client = await pool.connect();
		await client.query('UPDATE users SET first_name = $1, last_name = $2, user_email = $3, user_phone = $4 WHERE user_id = $5', [first_name, last_name, email, phone, user_id]);
		client.release();
		res.status(200).json({ message: 'User updated successfully' });
		console.log(`${decoded.username} updated user ${user_id}`);
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({ errorMessage: 'Failed to update user' });
	}
});

app.delete('/admin/delete/user', async (req, res) => {
	const { user_id } = req.body;
	const token = req.headers['authorization'].split(' ')[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded.isAdmin) {
			return res.status(403).json({ errorMessage: 'Unauthorized' });
		}
		const client = await pool.connect();
		await client.query('DELETE FROM users WHERE user_id = $1', [user_id]);
		client.release();
		res.status(200).json({ message: 'User deleted successfully' });
		console.log(`${decoded.username} deleted user ${user_id}`);
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ errorMessage: 'Failed to delete user' });
	}
});

app.delete('/admin/students/courses', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { user_id, string_id } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query('DELETE FROM register WHERE user_id = $1 AND string_id = $2', [user_id, string_id]);
    await client.query('UPDATE courses SET maximum_capacity = maximum_capacity + 1 WHERE string_id = $1', [string_id]);
    await client.query('COMMIT');
    client.release();
    res.status(200).json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Error removing course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});


app.get('/courses', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];  
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    if (decoded.isAdmin) {
      const result = await client.query('SELECT * FROM courses ORDER BY string_id');
      client.release();
      res.status(200).json(result.rows);
    } else {
      const result = await client.query('SELECT * FROM courses WHERE string_id NOT IN (SELECT string_id FROM register WHERE user_id = $1) ORDER BY string_id', [decoded.sub]);
      client.release();
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/courses', async (req, res) => {
  const { title, stringId, description, schedule, classroomNumber, maxCapacity, credits, cost } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('INSERT INTO courses (title, string_id, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [title, stringId, description, schedule, classroomNumber, maxCapacity, credits, cost]);
    client.release();
    console.log('Course created:', { title, description, schedule, classroomNumber, maxCapacity, credits, cost });
    res.status(201).json({ message: 'Course created' });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ errorMessage: 'Failed to create course ' + error });
  }
});


app.put('/courses/registered', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const { cartItems } = req.body;
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
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

app.put('/admin/edit/course', async (req, res) => {
  const { string_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('UPDATE courses SET title = $1, description = $2, schedule = $3, classroom_number = $4, maximum_capacity = $5, credit_hours = $6, tuition_cost = $7 WHERE string_id = $8', [title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost, string_id]);
    client.release();
    res.status(200).json({ message: 'Course updated successfully' });
    console.log(`${decoded.username} updated course ${string_id}`);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ errorMessage: 'Failed to update course' });
  }
});

app.delete('/admin/delete/course', async (req, res) => {
  const { string_id } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('DELETE FROM courses WHERE string_id = $1', [string_id]);
    client.release();
    res.status(200).json({ message: 'Course deleted successfully' });
    console.log(`${decoded.username} deleted course ${string_id}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ errorMessage: 'Failed to delete course' });
  }
});

app.delete('/courses/remove/:courseId', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { courseId } = req.params;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    await client.query('BEGIN');
    const checkCourse = await client.query(
      'SELECT * FROM register WHERE user_id = $1 AND string_id = $2',
      [decoded.sub, courseId]
    );
    if (checkCourse.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ error: 'Course not found in user registration' });
    }
    await client.query(
      'DELETE FROM register WHERE user_id = $1 AND string_id = $2',
      [decoded.sub, courseId]
    );
    await client.query(
      'UPDATE courses SET maximum_capacity = maximum_capacity + 1 WHERE string_id = $1',
      [courseId]
    );
    await client.query('COMMIT');
    client.release();
    res.status(200).json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Error removing course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});





app.post('/registered/students', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];
	const { string_id } = req.body;
	try {
			const decoded = jwt.verify(token, JWT_SECRET);
			if (!decoded.isAdmin) {
					return res.status(403).json({ errorMessage: 'Unauthorized' });
			}
			const client = await pool.connect();
			const result = await client.query(
					'SELECT * FROM users WHERE user_id IN (SELECT user_id FROM register WHERE string_id = $1)',
					[string_id]
			);
			client.release();
			res.status(200).json(result.rows);
	} catch (error) {
			console.error('Error fetching registered students:', error);
			res.status(500).json({ errorMessage: 'Failed to fetch registered students' });
	}
});

app.get('/students', async (req, res) => {
		const token = req.headers['Authorization']?.split(' ')[1];
    console.log(req.headers);
		try {
				const decoded = jwt.verify(token, JWT_SECRET);
				if (!decoded.isAdmin) {
						return res.status(403).json({ errorMessage: 'Unauthorized' });
				}
				const client = await pool.connect();
        let result;
        if (decoded.masterAdmin) {
          result = await client.query('SELECT * FROM users WHERE user_id != $1 ORDER BY user_id', [decoded.sub]);
        } else {
          result = await client.query('SELECT * FROM users WHERE user_id != $1 AND user_admin = false ORDER BY user_id', [decoded.sub]);
        }
				client.release();
				res.status(200).json(result.rows);
		} catch (error) {
				console.error('Error fetching students:', error);
				res.status(500).json({ errorMessage: 'Failed to fetch students' });
		}
});

app.get('/courses/schedule', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
  }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const client = await pool.connect();
        const result = await client.query(
            'SELECT string_id, title, schedule FROM courses WHERE string_id IN (SELECT string_id FROM register WHERE user_id = $1)',
            [decoded.sub]
        ); 
        client.release();
      res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});



// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} Database_url: ${process.env.DATABASE_URL}`);
});
