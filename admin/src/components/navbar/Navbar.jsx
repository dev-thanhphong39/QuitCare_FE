import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { logout } from "../../redux/features/userSlice";
import { BellOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // ✅ Effect để lock scroll khi mobile menu mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    setMobileMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showTracking =
    user && (user.role === "GUEST" || user.role === "CUSTOMER");
  const isStaff = user?.role === "STAFF";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <nav className="qc-navbar">
        <div className="qc-navbar-left">
          <img src={logo} alt="Quit Care Logo" className="qc-logo" />
          <div className="qc-brand-text">
            <div>QUIT</div>
            <div>CARE</div>
          </div>
        </div>

        {/* Desktop Menu */}
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

        {/* Hamburger Menu Button */}
        <div
          className={`qc-hamburger ${mobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Right Section */}
        {user ? (
          <div className="qc-navbar-user">
            {/* Notification */}
            <div className="qc-noti-wrapper">
              <Link
                to="/noti"
                className="qc-noti-link"
                onClick={() => {
                  setShowDropdown(false);
                  closeMobileMenu();
                }}
              >
                <div className="qc-noti-icon" title="Xem thông báo">
                  <BellOutlined style={{ fontSize: "20px" }} />
                </div>
              </Link>
            </div>

            {/* User Dropdown */}
            <div
              className="qc-navbar-user-container"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onClick={handleDropdownClick}
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
                  <Link
                    to="/profile"
                    onClick={() => {
                      setShowDropdown(false);
                      closeMobileMenu();
                    }}
                    className="qc-dropdown-item"
                  >
                    Hồ sơ
                  </Link>

                  {isStaff && (
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        setShowDropdown(false);
                        closeMobileMenu();
                      }}
                      className="qc-dropdown-item"
                    >
                      Quản lý
                    </Link>
                  )}

                  {!isStaff && (
                    <>
                      <Link
                        to="/viewadvise"
                        onClick={() => {
                          setShowDropdown(false);
                          closeMobileMenu();
                        }}
                        className="qc-dropdown-item"
                      >
                        Lịch tư vấn
                      </Link>
                      <Link
                        to="/history-transactions"
                        onClick={() => {
                          setShowDropdown(false);
                          closeMobileMenu();
                        }}
                        className="qc-dropdown-item"
                      >
                        Lịch sử giao dịch
                      </Link>
                      <Link
                        to="/viewsurvey"
                        onClick={() => {
                          setShowDropdown(false);
                          closeMobileMenu();
                        }}
                        className="qc-dropdown-item"
                      >
                        Khảo sát
                      </Link>
                    </>
                  )}

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
            <Link
              to="/register"
              className="qc-btn-register"
              onClick={closeMobileMenu}
            >
              ĐĂNG KÍ
            </Link>
            <Link
              to="/login"
              className="qc-btn-login"
              onClick={closeMobileMenu}
            >
              ĐĂNG NHẬP
            </Link>
          </div>
        )}
      </nav>

      {/* ✅ FIXED: Mobile Menu Overlay */}
      <div className={`qc-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="qc-mobile-menu-content">
          <ul className="qc-mobile-nav-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "qc-mobile-nav-link active" : "qc-mobile-nav-link"
                }
                onClick={closeMobileMenu}
              >
                TRANG CHỦ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive ? "qc-mobile-nav-link active" : "qc-mobile-nav-link"
                }
                onClick={closeMobileMenu}
              >
                BLOG
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ranking"
                className={({ isActive }) =>
                  isActive ? "qc-mobile-nav-link active" : "qc-mobile-nav-link"
                }
                onClick={closeMobileMenu}
              >
                XẾP HẠNG
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/planning"
                className={({ isActive }) =>
                  isActive ? "qc-mobile-nav-link active" : "qc-mobile-nav-link"
                }
                onClick={closeMobileMenu}
              >
                KẾ HOẠCH
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  isActive ? "qc-mobile-nav-link active" : "qc-mobile-nav-link"
                }
                onClick={closeMobileMenu}
              >
                ĐẶT LỊCH
              </NavLink>
            </li>
            {showTracking && (
              <li>
                <NavLink
                  to="/tracking"
                  className={({ isActive }) =>
                    isActive
                      ? "qc-mobile-nav-link active"
                      : "qc-mobile-nav-link"
                  }
                  onClick={closeMobileMenu}
                >
                  THEO DÕI
                </NavLink>
              </li>
            )}
          </ul>

          {/* Mobile Auth Buttons */}
          {!user && (
            <div className="qc-mobile-auth-buttons">
              <Link
                to="/register"
                className="qc-mobile-btn-register"
                onClick={closeMobileMenu}
              >
                ĐĂNG KÍ
              </Link>
              <Link
                to="/login"
                className="qc-mobile-btn-login"
                onClick={closeMobileMenu}
              >
                ĐĂNG NHẬP
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="qc-mobile-backdrop" onClick={closeMobileMenu} />
      )}
    </>
  );
};

export default Navbar;
