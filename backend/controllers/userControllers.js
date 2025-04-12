const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

// ==============================
// SIGNUP CONTROLLER
// ==============================
const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, phone, password, role } = req.body;

  db.query(`SELECT * FROM users WHERE LOWER(email) = LOWER(?)`, [email], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error." });

    if (result.length > 0) {
      return res.status(409).json({ msg: "This email is already in use!" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ msg: "Error hashing password." });

      db.query(
        `INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
        [username, email, phone, hash, role],
        (err, result) => {
          if (err) return res.status(500).json({ msg: "Error inserting user." });

          const newUser = {
            id: result.insertId,
            username,
            email,
            phone,
            role,
          };

          const token = jwt.sign(
            {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role,
              username: newUser.username,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          return res.status(201).json({
            msg: "User registered successfully.",
            token,
            user: newUser,
          });
        }
      );
    });
  });
};

// ==============================
// LOGIN CONTROLLER
// ==============================
const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error." });

    if (result.length === 0) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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

// ==============================
// LOGOUT CONTROLLER
// ==============================
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.status(200).json({ msg: "Logged out successfully." });
};

// ==============================
// VERIFY TOKEN MIDDLEWARE
// ==============================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token." });
    }
    req.user = decoded; // Attach user info to request
    next();
  });
};

module.exports = {
  signup,
  login,
  logout,
  verifyToken,
};
