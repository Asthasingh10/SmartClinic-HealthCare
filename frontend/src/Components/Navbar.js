import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [userRole, setUserRole] = useState(""); // To store the role of the user
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
  
    setIsAuthenticated(!!token);
    setUserRole(user?.role || "");
  }, []);
  

  const openNav = () => {
    setNav(!nav);
  };

  const handleBookAppointment = () => {
    navigate("/bookappointmentform"); // Navigate to the book appointment form page
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear role from localStorage
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(""); // Clear user role
    navigate("/");
  };

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/" className="navbar-logo">
          Health <span className="navbar-sign">+</span>
        </Link>
      </h1>

      {/* Desktop Navigation */}
      <ul className="navbar-items">
        <li>
          <Link to="/" className="navbar-links">
            Home
          </Link>
        </li>
        <li>
          <a href="#services" className="navbar-links">
            Services
          </a>
        </li>
        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        <li>
          <a href="#reviews" className="navbar-links">
            Reviews
          </a>
        </li>
        <li>
          <a href="#doctors" className="navbar-links">
            Doctors
          </a>
        </li>
      </ul>
      <div className="navbar-buttons">
        {isAuthenticated ? (
          <>
            {userRole === "patient" && (
                <button
                  className="book-appointment-btn"
                  type="button"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>
              )}
            {userRole === "doctor" && (
            <button
              className="book-appointment-btn"
              type="button"
              onClick={() => navigate("/viewappointments")}
            >
              View Appointments
            </button>
          )}
            <button
                  className="logout-btn"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )  : (
              <>
            <button
              className="signup-btn"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
            <button
              className="signup-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} to="/">
              Home
            </Link>
          </li>
          <li>
            <a onClick={openNav} href="#services">
              Services
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#about">
              About
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#reviews">
              Reviews
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#doctors">
              Doctors
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default Navbar;
