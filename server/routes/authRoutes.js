const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});
const JWT_SECRET = process.env.JWT_SECRET;

router.use(express.json());

router.post('/login', async (req, res) => {
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

router.post('/createAccount', async (req, res) => {
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

router.get('/user/profile', async (req, res) => {
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

router.put('/user/profile', async (req, res) => {
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

module.exports = router;
