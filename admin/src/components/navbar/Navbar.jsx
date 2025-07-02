import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { logout } from "../../redux/features/userSlice";
import { BellOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [completedToday, setCompletedToday] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem(`notifications-${accountId}`)) || [];
    const sorted = saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(sorted);

    const today = new Date().toISOString().slice(0, 10);
    const todayNoti = sorted.find(
      (n) => n.date.slice(0, 10) === today && n.message.includes("hoàn thành")
    );
    setCompletedToday(!!todayNoti);
  }, [accountId]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showTracking =
    user && (user.role === "GUEST" || user.role === "CUSTOMER");

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
          {/* 🔔 Thông báo */}
          <div className="qc-noti-wrapper">
            <Link
              to="/noti"
              className="qc-noti-link"
              onClick={() => setShowDropdown(false)}
            >
              <div
                className="qc-noti-icon"
                title={
                  completedToday
                    ? "🎉 Bạn đã hoàn thành mục tiêu hôm nay!"
                    : "⚠️ Bạn chưa hoàn thành mục tiêu hôm nay"
                }
              >
                <BellOutlined style={{ fontSize: "20px" }} />
                {notifications.length > 0 && (
                  <span className="qc-noti-badge">{notifications.length}</span>
                )}
              </div>
            </Link>

            <div className="qc-noti-modal">
              <div className="qc-noti-modal-header">🔔 Thông Báo Mới Nhận</div>
              <div className="qc-noti-modal-body">
                {notifications.length === 0 ? (
                  <p className="italic text-gray-500 text-sm">
                    Không có thông báo nào.
                  </p>
                ) : (
                  notifications.slice(0, 5).map((noti, idx) => {
                    const tracking = noti.dayKey
                      ? JSON.parse(
                          localStorage.getItem(
                            `track-${accountId}-${noti.dayKey}`
                          )
                        )
                      : null;
                    const smoked = parseInt(tracking?.smoked || 0);
                    const target = parseInt(tracking?.target || smoked);
                    const saved = Math.max(0, target - smoked) * 1000;

                    return (
                      <div key={idx} className="qc-noti-modal-item">
                        <div className="qc-noti-modal-date">
                          {new Date(noti.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="qc-noti-modal-msg">
                          {noti.message}
                          {noti.message.includes("hoàn thành") &&
                            noti.dayKey && (
                              <div className="qc-noti-modal-saved">
                                💰 Tiết kiệm hôm nay:{" "}
                                {saved.toLocaleString("vi-VN")} VND
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="qc-noti-modal-footer">
                <Link to="/noti" className="qc-noti-modal-viewall">
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <button onClick={toggleDropdown} className="qc-navbar-user-button">
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
          </button>
          <span className="qc-navbar-fullname">
            {user.fullName?.trim() || "Guest"}
          </span>
          {showDropdown && (
            <div className="qc-navbar-dropdown">
              <Link
                to="/edit-profile"
                onClick={() => setShowDropdown(false)}
                className="qc-dropdown-item"
              >
                Hồ sơ
              </Link>
              <Link
                to="/viewsurvey"
                onClick={() => setShowDropdown(false)}
                className="qc-dropdown-item"
              >
                Khảo sát
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
