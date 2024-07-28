require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/admin', adminRoutes);
app.use('/student', courseRoutes);
app.use('/auth', authRoutes);

// Catch-all handler to serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} Database_url: ${process.env.DATABASE_URL}`);
});
