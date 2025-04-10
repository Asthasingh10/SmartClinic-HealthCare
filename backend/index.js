require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
require('./config/db'); // Ensure your database connection is set here
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = 8080;

// CORS setup for your React frontend
app.use(cors({
  origin: 'http://localhost:3000', // your React frontend URL
  credentials: true,               // if using cookies or sessions
}));

// Middleware to check login status and pass to EJS
app.use((req, res, next) => {
  const token = req.cookies.token;
  res.locals.isLoggedIn = !!token;
  next();
});

app.use('/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
