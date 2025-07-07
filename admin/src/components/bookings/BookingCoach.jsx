import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import "./BookingCoach.css";

const Booking = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [coaches, setCoaches] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({}); // key: coachId, value: list of slots
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const from = currentMonth.startOf("month").format("YYYY-MM-DD");
  const to = currentMonth.endOf("month").format("YYYY-MM-DD");

  // Load danh sách coach
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await api.get("/session/coaches");
        setCoaches(res.data || []);

        // Sau khi có danh sách coach, fetch slot khả dụng
        res.data.forEach((coach) => {
          fetchAvailableSlots(coach);
        });
      } catch (err) {
        console.error("Lỗi khi lấy danh sách coach:", err);
        message.error("Không thể tải danh sách huấn luyện viên.");
      }
    };

    fetchCoaches();
  }, []);
  useEffect(() => {
    coaches.forEach((coach) => {
      const coachSlots = availableSlots[coach.id] || {};
      const defaultDate = Object.keys(coachSlots)[0];
  
      // Nếu chưa chọn ngày thì gán mặc định ngày đầu tiên có slot
      if (defaultDate && !selectedDates[coach.id]) {
        setSelectedDates((prev) => ({ ...prev, [coach.id]: defaultDate }));
        setSelectedSlots((prev) => ({ ...prev, [coach.id]: "" }));
      }
    });
  }, [coaches, availableSlots]);
  // Load slot theo coach
  const fetchAvailableSlots = async (coach) => {
    console.log("Đang fetch slot cho", coach.fullName);
    try {
      const res = await api.get("/session/available-slots", {
        params: {
          coachId: coach.id,
          from,
          to,
        },
      });

      // Format lại slot thành object theo từng ngày
      const rawSlots = res.data || [];
      const slotByDate = {};

      rawSlots.forEach((slot) => {
        if (slot.available) {
          if (!slotByDate[slot.date]) {
            slotByDate[slot.date] = [];
          }
          slotByDate[slot.date].push(slot.label); // hoặc `slot.label` tuỳ bạn
        }
      });

      // Lưu vào state
      setAvailableSlots((prev) => ({
        ...prev,
        [coach.id]: slotByDate,
      }));

      console.log("✅ Slot của", coach.fullName, ":", slotByDate);
    } catch (err) {
      console.error("❌ Lỗi khi lấy slot của", coach.fullName, ":", err);
    }
  };

  const handleDateChange = (coachId, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [coachId]: value,
    }));
    setSelectedSlots((prev) => ({
      ...prev,
      [coachId]: "",
    }));
  };

const handleSlotSelect = (coachId, slot) => {
  setSelectedSlots((prev) => ({
    ...prev,
    [coachId]: slot,
  }));
};

  const handleBooking = async (coach, coachName) => {
  const date = selectedDates[coach.id];
  const slot = selectedSlots[coach.id];

  console.log("✅ Slot của", coach.fullName, ":", slot);
  console.log("✅ dateSlot của", coach.fullName, ":", date);
  console.log("✅ ID", coach.fullName, ":", coach.id);
  if (!date || !slot) {
    message.warning("Vui lòng chọn ngày và khung giờ.");
    return;
  }

  try {
    const res = await api.post("/booking", {
      coachId: coach.id,
      appointmentDate: typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD"),
      start: dayjs(slot, "HH:mm").format("HH:mm:ss"),
    });

    console.log("Booking response:", res.data);
    message.success(`✅ Đã đặt lịch thành công cho ${coachName}`);
    setTimeout(() => navigate("/view-advise"), 1500);
  } catch (err) {
    console.log(err.response?.data);
    console.error("Lỗi đặt lịch:", err);
    message.error("❌ Đặt lịch thất bại. Vui lòng thử lại sau.");
  }
};

  

  return (
    <div className="booking-bg">
      <h1 className="booking-title">ĐẶT LỊCH TƯ VẤN</h1>
      {coaches.map((coach) => {
        const coachSlots = availableSlots[coach.id] || {};
        const datesWithSlots = Object.keys(coachSlots);
        const selectedDate = selectedDates[coach.id] || datesWithSlots[0] || "";
        const slotList = coachSlots[selectedDate] || [];

        return (
          <div className="booking-row" key={coach.id}>
            <div style={{ flex: 1 }}>
              <div className="booking-left">
                <img
                  src={coach.avatar || "/default-avatar.png"}
                  alt={coach.fullName}
                  className="booking-img"
                />
                <div className="booking-info">
                  <div className="booking-brand">QUITCARE</div>
                  <div className="booking-name">{coach.fullName}</div>
                  <div className="booking-hotline">Email: {coach.email}</div>
                </div>
              </div>
              <div className="booking-desc">
                Huấn luyện viên chuyên hỗ trợ tư vấn cai thuốc lá.
              </div>
            </div>

            <div className="booking-right">
              <div className="booking-date">
                Chọn ngày:
                <DatePicker
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(date) => {
                    if (date)
                      handleDateChange(coach.id, date.format("YYYY-MM-DD"));
                  }}
                  disabledDate={(current) => {
                    // Chỉ cho chọn các ngày nằm trong datesWithSlots
                    const validDates = datesWithSlots.map((d) =>
                      dayjs(d).format("YYYY-MM-DD")
                    );
                    return !validDates.includes(current.format("YYYY-MM-DD"));
                  }}
                  format="YYYY-MM-DD"
                  popupClassName="custom-datepicker-popup"
                />
              </div>

              <div className="booking-times">
                {slotList.map((slot, i) => (
                  <button
                    key={i}
                    className={`booking-slot ${
                      selectedSlots[coach.id] === slot ? "active" : ""
                    }`}
                    onClick={() => handleSlotSelect(coach.id, slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="booking-actions">
                <button
                  className="booking-btn booking-btn-primary"
                  onClick={() => handleBooking(coach, coach.fullName)}
                >
                  Đặt Lịch
                </button>
                <button
                  className="booking-btn booking-btn-secondary"
                  onClick={() => navigate("/viewadvise")}
                >
                  Xem Lịch Tư Vấn
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Booking;
