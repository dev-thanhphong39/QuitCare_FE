import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "./NotificationPage.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function NotificationPage() {
  const accountId = localStorage.getItem("accountId");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem(`notifications-${accountId}`)) || [];
    const sorted = saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(sorted);
  }, [accountId]);

  return (
    <>
      <Navbar />
      <div className="notification-container">
        <h2 className="notification-title">🔔 Thông Báo Theo Dõi</h2>

        {notifications.length === 0 ? (
          <p className="notification-empty">Không có thông báo nào.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((noti, index) => (
              <li key={index} className="notification-item">
                <div className="notification-date">
                  {format(new Date(noti.date), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="notification-message">
                  {noti.message}
                  {noti.message.includes("hoàn thành") && noti.dayKey && (
                    <>
                      <br />
                      <span className="notification-saved">
                        💰 Số tiền tiết kiệm hôm nay:{" "}
                        {(() => {
                          const tracking = JSON.parse(
                            localStorage.getItem(
                              `track-${accountId}-${noti.dayKey}`
                            )
                          );
                          const smoked = parseInt(tracking?.smoked || 0);
                          const target = parseInt(tracking?.target || smoked); // fallback nếu chưa lưu target

                          const saved = Math.max(0, target - smoked) * 1000;
                          return saved.toLocaleString("vi-VN") + " VND";
                        })()}
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}

export default NotificationPage;
