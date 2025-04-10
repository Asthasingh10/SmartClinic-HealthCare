import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Signup from './Components/Signup'
import Login from "./Components/Login";
import BookAppointmentForm from "./Components/BookAppointmentForm";

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book an appointment!");
      window.location.href = "/login"; // Redirect to login page
      return null; // Prevent rendering protected route
    }
    return children;
  };
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookappointmentform"
          element={
            <ProtectedRoute>
              <BookAppointmentForm />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  </div>
  );
}

export default App;
