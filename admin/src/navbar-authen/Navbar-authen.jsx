import React from "react";
import "./Navbar-authen.css";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

const Navbar_authen = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Quit Care Logo" className="logo" />
          <div className="brand-text">
            <div>QUIT</div>
            <div>CARE</div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar_authen;
