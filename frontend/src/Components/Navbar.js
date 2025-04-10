import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // If token exists, set authentication to true
  }, []);

  const openNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsAuthenticated(false); // Update state to reflect logout
    navigate("/"); // Redirect to login page
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

      {/* Conditionally render buttons based on authentication */}
      <div className="navbar-buttons">
        {isAuthenticated ? (
          <button
            className="logout-btn"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
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
