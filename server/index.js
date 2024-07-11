const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

const JWT_SECRET = 'your_jwt_secret';
const PORT = process.env.PORT || 3001;
const usersData = { users: [{ id: 1, username: 'admin', password: '$2a$10$Xe6dJrkuOMtDQooeMZ8I5uhMQo6YZ3KO0R/lisNdNxxGdbFHX3xLW' }] };
const users = usersData.users;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
