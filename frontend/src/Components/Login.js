import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css"; // Your custom CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // clear error on input change
  };

const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include if using cookies
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // ✅ Store token in localStorage if received
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
  
        navigate("/"); // Redirect on success
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Smart Clinic Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* 🔴 Error message */}
          {errorMessage && (
            <p className="error-message" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Signup here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
