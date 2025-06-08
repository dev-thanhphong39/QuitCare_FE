import React from "react";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
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
          <Link to="/">TRANG CHỦ</Link>
        </li>
        <li>
          <Link to="/blog">BLOG</Link>
        </li>
        <li>
          <Link to="/ranking">XẾP HẠNG</Link>
        </li>
        <li>
          <Link to="/planning">KẾ HOẠCH</Link>
        </li>
        <li>
          <Link to="/booking">ĐẶT LỊCH</Link>
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
