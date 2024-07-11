const express = require('express');
const { get } = require('http');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();


const JWT_SECRET = 'your_jwt_secret';
const PORT = process.env.PORT || 3001;
const usersData = fs.readFileSync('./data/users.json');
const users = JSON.parse(usersData).users;

app.use(express.json());

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

