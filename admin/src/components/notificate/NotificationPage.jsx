import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "./NotificationPage.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function NotificationPage() {
    const accountId = localStorage.getItem("accountId");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(`notifications-${accountId}`)) || [];
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
                                <div className="notification-message">{noti.message}</div>
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
