// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const conn = require('../db');

// Signup
router.post("/signup", (req, res) => {
    const { username, email, phone, password, role } = req.body;
  
    const query = "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
  
    db.query(query, [username, email, phone, password, role], (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Signup failed" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  conn.query(query, [email], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "No account found. Please sign up first." });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    req.session.user = user;
    return res.status(200).json({ message: "Login successful", user });
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.send('Logged out successfully');
  });
});

module.exports = router;
