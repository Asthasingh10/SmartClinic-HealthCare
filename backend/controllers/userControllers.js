const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { JWT_SECRET } = process.env;

// SIGNUP FUNCTION
// SIGNUP FUNCTION
const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, phone, password, role } = req.body;
  
  // Check if the email is already registered
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`,
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Database error." });
      }

      if (result.length > 0) {
        return res.status(409).send({ msg: "This email is already in use!" });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({ msg: "Error hashing password." });
        }

        // Insert the new user into the database
        db.query(
          `INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
          [username, email, phone, hash, role],
          (err) => {
            if (err) {
              return res.status(500).send({ msg: "Error inserting user." });
            }

            return res.status(201).send({ msg: "User registered successfully." });
          }
        );
      });
    }
  );
};

// LOGIN FUNCTION
// LOGIN FUNCTION
const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  
  // Find the user by email
  db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, result) => {
    if (err) {
      return res.status(500).send({ msg: "Database error." });
    }
    if (result.length === 0) {
      return res.status(401).send({ msg: "Email not found." });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ msg: "Invalid password." });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h", // expires in 1 hour
    });

    // Return the token and user info
    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
};

// LOGOUT FUNCTION
const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });

  // Optionally, you can send a response message.
  res.status(200).send({ msg: "Logged out successfully." });
};

module.exports = { signup, login, logout };
