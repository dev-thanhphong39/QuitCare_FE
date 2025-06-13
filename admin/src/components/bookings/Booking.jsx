import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Booking.css";

const doctors = [
  {
    name: "BS. Nguyễn Văn A",
    specialty: "Tim mạch",
    desc: "20 năm kinh nghiệm, tận tâm với bệnh nhân.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    slots: ["08:00", "09:00", "10:00", "14:00", "15:00"],
  },
  {
    name: "BS. Trần Thị B",
    specialty: "Nội tiết",
    desc: "Chuyên gia tư vấn sức khỏe nội tiết.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    slots: ["09:00", "10:30", "13:30", "16:00"],
  },
  {
    name: "BS. Lê Văn C",
    specialty: "Nhi khoa",
    desc: "Thân thiện với trẻ nhỏ, giàu kinh nghiệm.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    slots: ["08:30", "11:00", "15:00", "16:30"],
  },
  {
    name: "BS. Phạm Thị D",
    specialty: "Da liễu",
    desc: "Tư vấn & điều trị các bệnh về da.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    slots: ["09:30", "10:30", "14:30", "17:00"],
  },
  {
    name: "BS. Hoàng Văn E",
    specialty: "Chấn thương chỉnh hình",
    desc: "Chuyên phẫu thuật và phục hồi chức năng.",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    slots: ["08:00", "11:30", "13:00", "15:30"],
  },
];

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  return (
    <div>
      <Navbar />

      <div className="booking-bg-layout">
        <div className="side-banner left-banner">
          <div className="banner-text">
            <strong>“Mỗi ngày không thuốc lá là một chiến thắng cho sức khỏe!”</strong>
          </div>
        </div>
        <main className="booking-center">
          <div className="booking-container">
            <h2 className="booking-title">Đặt lịch với Coach</h2>
            <div className="date-picker-row">
              <label htmlFor="date-picker">Chọn ngày: </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker"
              />
            </div>
            <div className="doctor-list">
              {doctors.map((doc, idx) => (
                <div className="doctor-row" key={idx}>
                  <div className="doctor-profile">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="doctor-avatar"
                    />
                    <div className="doctor-info">
                      <div className="doctor-name">{doc.name}</div>
                      <div className="doctor-specialty">{doc.specialty}</div>
                      <div className="doctor-desc">{doc.desc}</div>
                    </div>
                  </div>
                  <div className="doctor-slots">
                    {doc.slots.map((slot, i) => (
                      <button className="slot-btn" key={i}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <div className="side-banner right-banner">
          <div className="banner-text">
            <strong>Bạn luôn có đội ngũ chuyên gia đồng hành trên hành trình bỏ thuốc lá!</strong>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;
