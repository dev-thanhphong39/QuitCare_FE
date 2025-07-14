import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { logout } from "../../redux/features/userSlice";
import { BellOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showTracking =
    user && (user.role === "GUEST" || user.role === "CUSTOMER");

  // Kiểm tra role STAFF
  const isStaff = user?.role === "STAFF";

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
        {showTracking && (
          <li>
            <NavLink
              to="/tracking"
              className={({ isActive }) =>
                isActive ? "qc-nav-link active" : "qc-nav-link"
              }
            >
              THEO DÕI
            </NavLink>
          </li>
        )}
      </ul>

      {user ? (
        <div
          className="qc-navbar-user"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* 🔔 Thông báo - Đã bỏ số đếm */}
          <div className="qc-noti-wrapper">
            <Link
              to="/noti"
              className="qc-noti-link"
              onClick={() => setShowDropdown(false)}
            >
              <div className="qc-noti-icon" title="Xem thông báo">
                <BellOutlined style={{ fontSize: "20px" }} />
              </div>
            </Link>
          </div>

          {/* Avatar - CẬP NHẬT HOVER DROPDOWN */}
          <div
            className="qc-navbar-user-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="qc-navbar-user-button">
              <img
                src={
                  user.avatar?.trim() ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
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
              <span className="qc-navbar-fullname">
                {user.fullName?.trim() || "Guest"}
              </span>
            </div>

            {showDropdown && (
              <div className="qc-navbar-dropdown">
                {/* Hồ sơ - hiển thị cho tất cả */}
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="qc-dropdown-item"
                >
                  Hồ sơ
                </Link>

                {/* Hiển thị cho STAFF */}
                {isStaff && (
                  <Link
                    to="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    className="qc-dropdown-item"
                  >
                    Quản lý
                  </Link>
                )}

                {/* Hiển thị cho NON-STAFF (GUEST, CUSTOMER, etc) */}
                {!isStaff && (
                  <>
                    <Link
                      to="/viewadvise"
                      onClick={() => setShowDropdown(false)}
                      className="qc-dropdown-item"
                    >
                      Lịch tư vấn
                    </Link>
                    <Link
                      to="/history-transactions"
                      onClick={() => setShowDropdown(false)}
                      className="qc-dropdown-item"
                    >
                      Lịch sử giao dịch
                    </Link>
                    <Link
                      to="/viewsurvey"
                      onClick={() => setShowDropdown(false)}
                      className="qc-dropdown-item"
                    >
                      Khảo sát
                    </Link>
                  </>
                )}

                {/* Đăng xuất - hiển thị cho tất cả */}
                <button
                  onClick={handleLogout}
                  className="qc-dropdown-item qc-logout-btn"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
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
