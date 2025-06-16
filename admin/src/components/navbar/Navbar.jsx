import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../../redux/features/userSlice"; // Ensure you have this action

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate("/login");
  };

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

      {/* User logic here */}
      {user ? (
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleDropdown}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <img
              src={
                user.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsVNNgXA9Qlq5GaQtWcqv0eyrFFLBJXWXpnw&s"
              }
              alt={user?.fullName || "User"}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32";
              }}
            />
          </button>
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: "8px",
                minWidth: "160px",
                background: "#fff",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 100,
              }}
            >
              <Link
                to="/dashboard_admin"
                style={{
                  display: "block",
                  padding: "8px 16px",
                  color: "#333",
                  textDecoration: "none",
                }}
                onClick={() => setShowDropdown(false)}
              >
                Hồ sơ
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="navbar-buttons">
          <div className="navbar-buttons">
            <Link to="/register" className="btn-register">
              ĐĂNG KÍ
            </Link>
            <Link to="/login" className="btn-login">
              ĐĂNG NHẬP
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
