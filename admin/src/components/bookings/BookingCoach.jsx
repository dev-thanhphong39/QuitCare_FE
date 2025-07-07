import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [disabledSlots, setDisabledSlots] = useState(() => {
    // Load disabled slots from localStorage
    const saved = localStorage.getItem("disabledSlots");
    return saved ? JSON.parse(saved) : {};
  }); // Track disabled slots per coach
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load only
  const [defaultDatesSet, setDefaultDatesSet] = useState(false); // Track if default dates are set
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const from = currentMonth.startOf("month").format("YYYY-MM-DD");
  const to = currentMonth.endOf("month").format("YYYY-MM-DD");

  // Load slot theo coach
  const fetchAvailableSlots = useCallback(
    async (coach) => {
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
          // Lưu tất cả slot (cả available và unavailable)
          if (!slotByDate[slot.date]) {
            slotByDate[slot.date] = [];
          }
          slotByDate[slot.date].push({
            label: slot.label,
            available: slot.available,
            start: slot.start,
            end: slot.end,
          });
        });

        // Lưu vào state - sử dụng callback để tránh race condition
        setAvailableSlots((prev) => ({
          ...prev,
          [coach.id]: slotByDate,
        }));

        console.log("✅ Slot của", coach.fullName, ":", slotByDate);
        return slotByDate; // Return để có thể await
      } catch (err) {
        console.error("❌ Lỗi khi lấy slot của", coach.fullName, ":", err);
        return {};
      }
    },
    [from, to]
  ); // Only re-create when from/to changes

  // Load danh sách coach (chỉ chạy 1 lần)
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await api.get("/session/coaches");
        const coachesData = res.data || [];
        setCoaches(coachesData);

        // Fetch slots cho tất cả coaches
        const slotPromises = coachesData.map((coach) =>
          fetchAvailableSlots(coach)
        );
        await Promise.all(slotPromises);

        // Chỉ set initial load sau khi tất cả slots đã load xong
        setInitialLoad(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách coach:", err);
        message.error("Không thể tải danh sách huấn luyện viên.");
      }
    };

    fetchCoaches();
  }, []); // KHÔNG có dependency để tránh re-run

  // Set default dates (chỉ chạy sau khi initial load hoàn tất)
  useEffect(() => {
    if (initialLoad || defaultDatesSet) return;

    // Lấy snapshot của data hiện tại để tránh closure issue
    const currentCoaches = coaches;
    const currentAvailableSlots = availableSlots;
    const currentSelectedDates = selectedDates;

    currentCoaches.forEach((coach) => {
      const coachSlots = currentAvailableSlots[coach.id] || {};
      const defaultDate = Object.keys(coachSlots)[0];

      // Nếu chưa chọn ngày thì gán mặc định ngày đầu tiên có slot
      if (defaultDate && !currentSelectedDates[coach.id]) {
        setSelectedDates((prev) => ({ ...prev, [coach.id]: defaultDate }));
        setSelectedSlots((prev) => ({ ...prev, [coach.id]: "" }));
      }
    });

    setDefaultDatesSet(true); // Đánh dấu đã set default dates
  }, [initialLoad]); // CHỈ depend vào initialLoad

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
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const selectedDate = selectedDates[coachId];
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;

    // Kiểm tra slot có bị disabled không
    if (disabledSlots[slotKey]) {
      return; // Không cho chọn slot đã disabled
    }

    setSelectedSlots((prev) => ({
      ...prev,
      [coachId]: slotLabel,
    }));
  };

  const handleBooking = async (coach, coachName) => {
    const date = selectedDates[coach.id];
    const slot = selectedSlots[coach.id];

    console.log("✅ Booking data:", { coachId: coach.id, date, slot });

    if (!date || !slot) {
      message.warning("Vui lòng chọn ngày và khung giờ.");
      return;
    }

    const slotKey = `${coach.id}-${date}-${slot}`;

    // Ngăn không cho đặt lịch nếu slot đã disabled
    if (disabledSlots[slotKey]) {
      message.warning("Slot này đã được đặt!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/booking", {
        coachId: coach.id,
        appointmentDate:
          typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD"),
        start: slot,
      });

      console.log("Booking response:", res.data);
      message.success(`✅ Đã đặt lịch thành công cho ${coachName}`);

      // Disable slot đã đặt - KHÔNG fetch lại slots
      const newDisabledSlots = {
        ...disabledSlots,
        [slotKey]: true,
      };
      setDisabledSlots(newDisabledSlots);

      // Save to localStorage
      localStorage.setItem("disabledSlots", JSON.stringify(newDisabledSlots));

      // Clear selection nhưng KHÔNG fetch lại slots
      setSelectedSlots((prev) => ({
        ...prev,
        [coach.id]: "",
      }));

      // Redirect after 1.5 seconds
      setTimeout(() => navigate("/viewadvise"), 1500);
    } catch (err) {
      console.log(err.response?.data);
      console.error("Lỗi đặt lịch:", err);

      if (err.response?.status === 400) {
        message.error(
          "❌ Dữ liệu đặt lịch không hợp lệ. Vui lòng kiểm tra lại."
        );
      } else if (err.response?.status === 409) {
        message.error("❌ Lịch này đã được đặt bởi người khác.");
        // Disable slot nếu đã được đặt - KHÔNG fetch lại slots
        const newDisabledSlots = {
          ...disabledSlots,
          [slotKey]: true,
        };
        setDisabledSlots(newDisabledSlots);

        // Save to localStorage
        localStorage.setItem("disabledSlots", JSON.stringify(newDisabledSlots));
      } else {
        message.error("❌ Đặt lịch thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isSlotDisabled = (coachId, slot, selectedDate) => {
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;

    // Kiểm tra nếu slot đã disabled locally
    if (disabledSlots[slotKey]) return true;

    // Kiểm tra nếu slot không available từ server
    if (typeof slot === "object" && slot.available === false) return true;

    return false;
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
                {slotList.map((slot, i) => {
                  const slotLabel =
                    typeof slot === "string" ? slot : slot.label;
                  const isDisabled = isSlotDisabled(
                    coach.id,
                    slot,
                    selectedDate
                  );
                  const isSelected = selectedSlots[coach.id] === slotLabel;

                  return (
                    <button
                      key={i}
                      className={`booking-slot ${isSelected ? "active" : ""} ${
                        isDisabled ? "disabled" : ""
                      }`}
                      onClick={() =>
                        !isDisabled && handleSlotSelect(coach.id, slot)
                      }
                      disabled={isDisabled}
                      style={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        backgroundColor: isDisabled ? "#666" : undefined,
                      }}
                    >
                      {slotLabel}
                      {isDisabled && (
                        <span
                          style={{
                            fontSize: "10px",
                            display: "block",
                            marginTop: "2px",
                            color: "#ff6b6b",
                          }}
                        >
                          Đã đặt
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="booking-actions">
                <button
                  className={`booking-btn booking-btn-primary ${
                    loading ? "loading" : ""
                  }`}
                  onClick={() => handleBooking(coach, coach.fullName)}
                  disabled={loading}
                >
                  {loading ? "Đang đặt..." : "Đặt Lịch"}
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
