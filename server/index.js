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
        client = await pool.connect(); // Acquire a client from the pool
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

// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} Database_url: ${process.env.DATABASE_URL}`);
});
