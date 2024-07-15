const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

const JWT_SECRET = 'your_jwt_secret';
const PORT = process.env.PORT || 3001;
const usersData = { users: [{ id: 1, username: 'admin', password: '$2a$10$Xe6dJrkuOMtDQooeMZ8I5uhMQo6YZ3KO0R/lisNdNxxGdbFHX3xLW' }] };
const users = usersData.users;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api', (req, res) => {
    res.json({ message: 'Backend Online!' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        console.log('login failed');
        return res.status(401).json({ errorMessage: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        console.log('login failed');
        return res.status(401).json({ errorMessage: 'Invalid username or password' });
    };

    const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
    console.log('login successful, token generated');
    return res.json({ token: token });
});

// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
