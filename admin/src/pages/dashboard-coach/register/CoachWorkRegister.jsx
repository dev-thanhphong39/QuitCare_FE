import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../configs/axios";
import { useNavigate } from "react-router-dom";
import "./CoachWorkRegister.css";

const CoachWorkRegister = () => {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const user = useSelector((state) => state.user);
  const accountId = user?.id;
  const navigate = useNavigate();

  // Lấy ngày hiện tại và ngày sau 2 tháng
  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(today.getMonth() + 2);

  // Chuyển sang định dạng YYYY-MM-DD
  const minDate = today.toISOString().split("T")[0];
  const maxDate = twoMonthsLater.toISOString().split("T")[0];

  const isValidDate = (inputDate) => {
    const selected = new Date(inputDate);
    return (
      inputDate.match(/^\d{4}-\d{2}-\d{2}$/) &&
      !isNaN(selected.getTime()) &&
      selected >= new Date(today.toDateString()) &&
      selected <= twoMonthsLater
    );
  };

  const handleRegister = async () => {
    if (!accountId) {
      setStatus("❌ Không tìm thấy người dùng!");
      return;
    }
    
    if (!isValidDate(date)) {
      setStatus("❌ Ngày không hợp lệ! Xin hãy nhập lại.");
      return;
    }
    try {
      await api.post(`/session`, null, { 
        params: { date } 
      });
      await api.post(`/session/register`, { date, accountId });
      setStatus("✅ Đăng ký thành công!");
    } catch (error) {
      console.error("❌ Error:", error);
      setStatus("❌ Đăng ký thất bại! Có thể ngày đăng kí đã tồn tại");
    }
  };

  return (
    
    <div className="coach-register-container">
      <h2>Đăng ký ngày làm việc</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="date-input"
        min={minDate}
        max={maxDate}
      />
      <button onClick={handleRegister} className="submit-btn">
        Đăng ký
      </button>
      <p
        className={`status-message ${
          status.includes("✅") ? "status-success" : "status-error"
        }`}
      >
        {status}
      </p>
      <button onClick={() => navigate("/dashboard-coach/listview")} className="view-btn">
        Xem lịch đã đăng ký
      </button>
    </div>
  );
};

export default CoachWorkRegister;
