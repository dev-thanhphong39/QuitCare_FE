import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { logout } from "../../redux/features/userSlice";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="qc-navbar">
      <div className="qc-navbar-left">
        <img src={logo} alt="Quit Care Logo" className="qc-logo" />
        <div className="qc-brand-text">
          <div>QUIT</div>
          <div>CARE</div>
        </div>
      </div>

      <ul className="qc-navbar-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "qc-nav-link active" : "qc-nav-link"
            }
          >
            TRANG CHỦ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? "qc-nav-link active" : "qc-nav-link"
            }
          >
            BLOG
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ranking"
            className={({ isActive }) =>
              isActive ? "qc-nav-link active" : "qc-nav-link"
            }
          >
            XẾP HẠNG
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/planning"
            className={({ isActive }) =>
              isActive ? "qc-nav-link active" : "qc-nav-link"
            }
          >
            KẾ HOẠCH
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive ? "qc-nav-link active" : "qc-nav-link"
            }
          >
            ĐẶT LỊCH
          </NavLink>
        </li>
      </ul>

      {user ? (
        <div className="qc-navbar-user" style={{ position: "relative" }}>
          <button onClick={toggleDropdown} className="qc-navbar-user-button">
            <img
              src={
                user.avatar && user.avatar.trim()
                  ? user.avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullName?.trim() || "User"
                    )}&background=ececec&color=555&size=64&rounded=true`
              }
              alt={user.fullName?.trim() || "User"}
              className="qc-navbar-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=User&background=ececec&color=555&size=64&rounded=true";
              }}
            />
          </button>
          {showDropdown && (
            <div className="qc-navbar-dropdown">
              <Link
                to="/edit-profile"
                onClick={() => setShowDropdown(false)}
                className="qc-dropdown-item"
              >
                Hồ sơ
              </Link>
              <button
                onClick={handleLogout}
                className="qc-dropdown-item qc-logout-btn"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="qc-navbar-buttons">
          <Link to="/register" className="qc-btn-register">
            ĐĂNG KÍ
          </Link>
          <Link to="/login" className="qc-btn-login">
            ĐĂNG NHẬP
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
