require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const db=require('./config/db'); // Ensure your database connection is set here
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const app = express();
const {verifyToken}=require("./controllers/userControllers")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = 8080;

// CORS setup for your React frontend
app.use(cors({
  origin: 'http://localhost:3000', // your React frontend URL
  credentials: true,   
}));

// Middleware to check login status and pass to EJS
app.use((req, res, next) => {
  const token = req.cookies.token;
  res.locals.isLoggedIn = !!token;
  next();
});

app.use('/auth', authRoutes);

app.get('/doctors', (req, res) => {
  const query = "SELECT username FROM users WHERE role = 'doctor'"; 
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

//book an appointment
app.post('/booking', (req, res) => {
  const { patientName, patientEmail, doctor, appointmentDate, appointmentTime } = req.body;

  if (!patientName || !patientEmail || !doctor || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
      INSERT INTO appointments (patient_name, patient_email, doctor, appointment_date, appointment_time)
      VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [patientName, patientEmail, doctor, appointmentDate, appointmentTime], (err, result) => {
      if (err) {
          console.error('Error saving appointment:', err);
          return res.status(500).json({ error: 'Failed to book appointment' });
      }

      res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
  });
});

app.get('/viewappointments',verifyToken, (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'You are not authorized to view appointments.' });
  }
  // Fetch appointments from the database
  db.query('SELECT patient_name, doctor, appointment_date, appointment_time, patient_email FROM appointments', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching appointments.' });
    }
    res.json(results);
  });
});


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
