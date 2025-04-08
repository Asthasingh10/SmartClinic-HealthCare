// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 8080;

// Add this BEFORE other middlewares
app.use(cors({
  origin: 'http://localhost:3000', // your React frontend
  credentials: true,               // if using cookies or sessions
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true
}));

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
