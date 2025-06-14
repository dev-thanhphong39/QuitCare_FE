import React from "react";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Quit Care Logo" className="logo" />
        <div className="brand-text">
          <div>QUIT</div>
          <div>CARE</div>
        </div>
      </div>

      <ul className="navbar-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            TRANG CHỦ
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            BLOG
          </NavLink>
        </li>
        <li>
          <NavLink to="/ranking" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            XẾP HẠNG
          </NavLink>
        </li>
        <li>
          <NavLink to="/planning" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            KẾ HOẠCH
          </NavLink>
        </li>
        <li>
          <NavLink to="/booking" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            ĐẶT LỊCH
          </NavLink>
        </li>
      </ul>

      <div className="navbar-buttons">
        <Link to="/register" className="btn-register">
          ĐĂNG KÍ
        </Link>
        <Link to="/login" className="btn-login">
          ĐĂNG NHẬP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
