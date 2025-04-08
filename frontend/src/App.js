import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Signup from './Components/Signup'
import Login from "./Components/Login";
function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  </div>
  );
}

export default App;
