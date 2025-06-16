import React, { useState } from "react";
import "./BookingCoach.css";

const clinics = [
  {
    name: "NGUYỄN DUY TRINH",
    hotline: "1900 1559",
    phone: "0786 777 999",
    desc: "Giám đốc Bệnh viện Phổi Trung ương. Điều hành nhiều chiến dịch quốc gia phòng chống tác hại của thuốc lá. Chuyên sâu về bệnh phổi, phòng ngừa và điều trị các bệnh liên quan đến hút thuốc.Tư vấn chính sách, tổ chức các chương trình hỗ trợ cai nghiện tại cộng đồng.",
    image: "",
  },
  {
    name: "NGUYỄN DUY TRINH",
    hotline: "1900 1559",
    phone: "0786 777 999",
    desc: "Viện trưởng Viện Nghiên cứu Sức khỏe Cộng đồng (RICHS). Chuyên sâu về bệnh phổi, phòng ngừa và điều trị các bệnh liên quan đến hút thuốc.Rất nhiều trung tâm y tế dự phòng địa phương (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ...) có chuyên viên tư vấn cai thuốc lá miễn phí.",
    image: "",
  },
];

const timeSlots = [
  "7:00 - 9:00",
  "9:00 - 11:00",
  "12:00 - 14:00",
  "15:00 - 17:00",
];



const Booking = () => {
    const [selectedDates, setSelectedDates] = useState(
      clinics.map(() => "2025-06-16")
    );
  
    const handleDateChange = (idx, value) => {
      const newDates = [...selectedDates];
      newDates[idx] = value;
      setSelectedDates(newDates);
    };
  return (
    <div className="booking-bg">
      <h1 className="booking-title">ĐẶT LỊCH TƯ VẤN</h1>
      {clinics.map((clinic, idx) => (
        <div className="booking-row" key={idx}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="booking-left">
              <img src={clinic.image} alt="clinic" className="booking-img" />
              <div className="booking-info">
                <div className="booking-brand">QUITCARE</div>
                <div className="booking-name">{clinic.name}</div>
                <div className="booking-hotline">
                  HOTLINE : {clinic.hotline}
                  <br />
                  PHONE : {clinic.phone}
                </div>
              </div>
            </div>
            <div className="booking-desc">{clinic.desc}</div>
          </div>

          <div className="booking-right">
            <div className="booking-date">
              Chọn ngày :{" "}
              <input
                type="date"
                value={selectedDates[idx]}
                onChange={(e) => handleDateChange(idx, e.target.value)}
                className="booking-date-input"               
              />
            </div>
            <div className="booking-times">
              {timeSlots.map((slot, i) => (
                <button
                  key={i}
                  className={`booking-slot ${
                    [0, 3, 4, 6, 8].includes(i) ? "active" : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="booking-actions">
              <button className="booking-btn booking-btn-primary">
                Đặt Lịch
              </button>
              <button className="booking-btn booking-btn-secondary">
                Phòng Khám
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Booking;
