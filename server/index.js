require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/curricula', require('./routes/curricula'));
app.use('/api/students', require('./routes/students'));
app.use('/api/grades', require('./routes/grades'));

// SERVE STATIC FRONTEND
app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Universal GPA Platform Server is running!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
