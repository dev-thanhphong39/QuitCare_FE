// CoachWorkList.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../configs/axios";
import "./CoachWorkList.css";

const CoachWorkList = () => {
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const [workDates, setWorkDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/session`, {
          params: { accountId },
        });
        const activeSessions = res.data.filter((s) => !s.delete);
        setWorkDates(activeSessions);
      } catch (err) {
        setError("Không thể tải danh sách.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  const groupedByMonth = workDates.reduce((acc, session) => {
    const date = session.date;
    const [year, month] = date.split("-");
    const monthKey = `${year}-${month}`;
    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][date]) acc[monthKey][date] = [];
    acc[monthKey][date].push(session);
    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedByMonth).sort();

  const toggleDate = (date) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  if (loading) return <p className="loading-text">Đang tải...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="coach-work-container">
      <h2 className="heading">📅 Lịch làm việc theo tháng và ngày</h2>

      {sortedMonths.map((month) => {
        const dates = Object.keys(groupedByMonth[month]).sort();
        return (
          <div key={month} className="month-box">
            <h3 className="month-title">🗓️ Tháng {month}</h3>
            <div className="date-card-container">
              {dates.map((date) => (
                <div
                  className="date-card"
                  key={date}
                  onClick={() => toggleDate(date)}
                >
                  <h4 className="date-title">📅 {date}</h4>
                  {expandedDate === date && (
                    <ul className="session-list">
                      {groupedByMonth[month][date].map((s) => (
                        <li key={s.id} className="session-item">
                          🕒 <strong>{s.start}</strong> → <strong>{s.end}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CoachWorkList;
