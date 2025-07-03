import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  message,
  Card,
  Tag,
  Progress,
  Statistic,
  Row,
  Col,
  Switch,
} from "antd";
import {
  CalendarOutlined,
  TrophyOutlined,
  HeartOutlined,
  SmileOutlined,
  BugOutlined,
} from "@ant-design/icons";
import {
  format,
  startOfDay,
  differenceInDays,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getMonth,
  getYear,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./TrackingPage.css";

const SYMPTOMS = {
  SYMPTOM1: "Thèm thuốc lá",
  SYMPTOM2: "Thèm ăn",
  SYMPTOM3: "Ho dai dẳng",
  SYMPTOM4: "Triệu chứng cảm cúm",
  SYMPTOM5: "Thay đổi tâm trạng",
  SYMPTOM6: "Táo bón",
};

const SYMPTOM_MESSAGES = {
  SYMPTOM1:
    "Thèm thuốc là triệu chứng bình thường khi bạn đang cai thuốc. Hãy thử nhai kẹo cao su hoặc đi dạo để làm dịu cảm giác này.",
  SYMPTOM2:
    "Nicotin giúp điều chỉnh đường huyết, nên khi cai thuốc bạn sẽ cảm thấy thèm ăn hơn. Hãy duy trì chế độ ăn lành mạnh.",
  SYMPTOM3:
    "Ho nhiều hơn là dấu hiệu tốt! Phổi bạn đang dần phục hồi và làm sạch các chất độc tồn đọng.",
  SYMPTOM4:
    "Bạn có thể thấy hơi sốt, khó chịu - đây là phản ứng tự nhiên của cơ thể khi không còn nicotin.",
  SYMPTOM5:
    "Cảm thấy cáu gắt là phản ứng phổ biến. Hãy thử thư giãn, đi bộ, trò chuyện với bạn bè.",
  SYMPTOM6:
    "Cai thuốc có thể làm chậm tiêu hóa. Hãy uống đủ nước và ăn nhiều rau xanh, thực phẩm giàu chất xơ.",
};

const TrackingPage = () => {
  const accountId = localStorage.getItem("accountId");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [smokingStatusId, setSmokingStatusId] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [todayData, setTodayData] = useState({
    cigarettes_smoked: "",
    symptoms: [],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    totalPoints: 0,
    averageProgress: 0,
  });

  // Thêm test mode state
  const [isTestMode, setIsTestMode] = useState(
    localStorage.getItem(`testMode_${accountId}`) === "true"
  );

  // Thêm state cho navigation tháng
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (accountId) {
      initializeData();
    } else {
      message.error("Vui lòng đăng nhập để xem trang theo dõi.");
    }
  }, [accountId]);

  // Load dữ liệu của ngày được chọn khi thay đổi selectedDate
  useEffect(() => {
    loadSelectedDateData();
  }, [selectedDate, trackingData]);

  const initializeData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPlan(),
        fetchSmokingStatus(),
        loadTrackingData(),
      ]);
    } catch (error) {
      console.error("Lỗi khởi tạo dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu của ngày được chọn vào form
  const loadSelectedDateData = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const selectedData = trackingData[dateStr];

    if (selectedData && selectedData.submitted) {
      setTodayData({
        cigarettes_smoked: selectedData.cigarettes_smoked.toString(),
        symptoms: selectedData.symptoms || [],
        notes: selectedData.notes || "",
      });
    } else {
      setTodayData({
        cigarettes_smoked: "",
        symptoms: [],
        notes: "",
      });
    }
  };

  // Toggle test mode
  const toggleTestMode = (checked) => {
    setIsTestMode(checked);
    localStorage.setItem(`testMode_${accountId}`, checked.toString());

    if (checked) {
      message.info("🔧 Đã bật chế độ Test - Có thể nhập dữ liệu cho mọi ngày");
    } else {
      message.info("🔒 Đã tắt chế độ Test - Chỉ nhập được dữ liệu hôm nay");
    }
  };

  // Lấy kế hoạch cai thuốc
  const fetchPlan = async () => {
    try {
      const response = await api.get(`/v1/customers/${accountId}/quit-plans`);
      if (response.data) {
        setPlan(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi lấy kế hoạch:", error);
      message.error("Không thể tải kế hoạch. Vui lòng tạo kế hoạch trước.");
    }
    return null;
  };

  // Lấy smoking status
  const fetchSmokingStatus = async () => {
    try {
      const response = await api.get(`/smoking-status/account/${accountId}`);
      if (response.data && response.data.id) {
        setSmokingStatusId(response.data.id);
        return response.data.id;
      }
    } catch (error) {
      console.error("Lỗi lấy smoking status:", error);
    }
    return null;
  };

  // Load dữ liệu theo dõi từ localStorage
  const loadTrackingData = () => {
    const savedData = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`tracking_${accountId}_`)) {
        const dateStr = key.replace(`tracking_${accountId}_`, "");
        try {
          savedData[dateStr] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error("Lỗi parse dữ liệu:", e);
        }
      }
    });
    setTrackingData(savedData);
    calculateStats(savedData);
  };

  // Tính toán thống kê (không bao gồm dữ liệu test)
  const calculateStats = (data) => {
    // Lọc bỏ dữ liệu test khỏi thống kê
    const realDataEntries = Object.entries(data).filter(
      ([_, value]) => !value.isTestData
    );

    const completedDays = realDataEntries.filter(
      ([_, value]) => value.submitted
    ).length;

    const totalPoints = realDataEntries.reduce(
      (sum, [_, value]) => sum + (value.points || 0),
      0
    );

    const averageProgress =
      completedDays > 0
        ? realDataEntries.reduce((sum, [_, value]) => {
            if (value.submitted && value.target > 0) {
              return (
                sum +
                Math.max(
                  0,
                  ((value.target - value.cigarettes_smoked) / value.target) *
                    100
                )
              );
            }
            return sum;
          }, 0) / completedDays
        : 0;

    setStats({
      totalDays: realDataEntries.length,
      completedDays,
      totalPoints,
      averageProgress: Math.round(averageProgress),
    });
  };

  // Lấy stage hiện tại dựa trên ngày
  const getCurrentStage = (date) => {
    if (!plan || !plan.stages) return null;

    const planStartDate = new Date(plan.localDateTime);
    const daysDiff = differenceInDays(date, planStartDate);

    if (plan.systemPlan) {
      // Kế hoạch hệ thống: mỗi stage = 4 tuần = 28 ngày
      const stageIndex = Math.floor(daysDiff / 28);
      return plan.stages[stageIndex] || plan.stages[plan.stages.length - 1];
    } else {
      // Kế hoạch tự tạo: cần parse week_range
      let totalDays = 0;
      for (const stage of plan.stages) {
        const stageDays = parseWeekRangeToDays(stage.week_range);
        if (daysDiff < totalDays + stageDays) {
          return stage;
        }
        totalDays += stageDays;
      }
      return plan.stages[plan.stages.length - 1];
    }
  };

  // Parse week range thành số ngày
  const parseWeekRangeToDays = (weekRange) => {
    if (!weekRange) return 7;

    const match = weekRange.match(/(\d+)[-–](\d+)/);
    if (match) {
      const startWeek = parseInt(match[1]);
      const endWeek = parseInt(match[2]);
      return (endWeek - startWeek + 1) * 7;
    }

    const singleMatch = weekRange.match(/(\d+)/);
    if (singleMatch) {
      return 7; // 1 tuần
    }

    return 7;
  };

  // Xử lý thay đổi input
  const handleInputChange = (field, value) => {
    setTodayData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý thay đổi triệu chứng
  const handleSymptomChange = (symptom, checked) => {
    setTodayData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  // Tính điểm
  const calculatePoints = (smoked, target) => {
    const basePoints = 10;
    const smokedCount = parseInt(smoked) || 0;

    if (smokedCount <= target) {
      const savedCigs = target - smokedCount;
      return basePoints + 50 + savedCigs * 5;
    } else {
      const excessCigs = smokedCount - target;
      return Math.max(5, basePoints - excessCigs * 3);
    }
  };

  // Lưu dữ liệu theo dõi
  const handleSubmit = async () => {
    const currentStage = getCurrentStage(selectedDate);
    if (!currentStage) {
      message.error("Không tìm thấy giai đoạn phù hợp.");
      return;
    }

    const cigarettes_smoked = parseInt(todayData.cigarettes_smoked) || 0;
    const points = calculatePoints(
      cigarettes_smoked,
      currentStage.targetCigarettes
    );
    const mainSymptom =
      todayData.symptoms.length > 0 ? todayData.symptoms[0] : "SYMPTOM1";

    setSubmitting(true);
    try {
      // Chỉ gọi API nếu không phải test mode hoặc là ngày hôm nay
      const isToday = isSameDay(selectedDate, new Date());

      if (!isTestMode || isToday) {
        // Gọi API lưu progress
        const progressData = {
          date: format(selectedDate, "yyyy-MM-dd"),
          cigarettes_smoked,
          quitHealthStatus: mainSymptom,
          quitProgressStatus: "SUBMITTED",
          quitPlanStageId: currentStage.id,
          smokingStatusId,
        };

        await api.post("/quit-progress", progressData);
      }

      // Lưu vào localStorage
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const trackingEntry = {
        ...todayData,
        cigarettes_smoked,
        target: currentStage.targetCigarettes,
        points,
        submitted: true,
        submittedAt: new Date().toISOString(),
        stageId: currentStage.id,
        isTestData: isTestMode && !isToday, // Đánh dấu dữ liệu test
      };

      localStorage.setItem(
        `tracking_${accountId}_${dateStr}`,
        JSON.stringify(trackingEntry)
      );

      // Cập nhật state
      const newTrackingData = {
        ...trackingData,
        [dateStr]: trackingEntry,
      };
      setTrackingData(newTrackingData);
      calculateStats(newTrackingData);

      // Cập nhật tổng điểm (chỉ cho dữ liệu thật)
      if (!isTestMode || isToday) {
        const currentTotal = parseInt(
          localStorage.getItem(`total_points_${accountId}`) || "0"
        );
        const newTotal = currentTotal + points;
        localStorage.setItem(`total_points_${accountId}`, newTotal.toString());
      }

      // Hiển thị popup thành công
      showSuccessPopup(
        cigarettes_smoked,
        currentStage.targetCigarettes,
        points,
        0,
        isTestMode && !isToday
      );

      message.success(
        isTestMode && !isToday
          ? "📝 Lưu dữ liệu test thành công!"
          : "✅ Lưu dữ liệu thành công!"
      );
    } catch (error) {
      console.error("Lỗi lưu dữ liệu:", error);
      message.error("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Hiển thị popup thành công
  const showSuccessPopup = (
    smoked,
    target,
    points,
    totalPoints,
    isTestData = false
  ) => {
    const savedCigs = Math.max(0, target - smoked);
    const savedMoney = savedCigs * 1000;

    let content = "";

    if (isTestData) {
      content += `
        <div class="quit-tracking-test-notice">
          <h4>🔧 Chế độ Test - Dữ liệu mẫu</h4>
          <p>Dữ liệu này chỉ để test giao diện, không ảnh hưởng đến điểm thật.</p>
        </div>
      `;
    }

    if (smoked <= target) {
      content += `
        <div class="quit-tracking-success-popup">
          <h3>🎉 Chúc mừng! Bạn đã hoàn thành mục tiêu ${
            isTestData ? "mẫu" : "hôm nay"
          }!</h3>
          <p>💰 Tiết kiệm: ${savedMoney.toLocaleString()} VND</p>
          <p>⭐ Điểm ${isTestData ? "mẫu" : "hôm nay"}: +${points}</p>
          ${!isTestData ? `<p>🏆 Tổng điểm: ${totalPoints}</p>` : ""}
        </div>
      `;
    } else {
      content += `
        <div class="quit-tracking-warning-popup">
          <h3>⚠️ ${
            isTestData ? "Dữ liệu mẫu:" : "Hôm nay"
          } bạn đã hút nhiều hơn kế hoạch</h3>
          <p>Đừng nản lòng! ${
            isTestData ? "Đây chỉ là test." : "Ngày mai hãy cố gắng hơn nhé!"
          }</p>
          <p>⭐ Điểm ${isTestData ? "mẫu" : "hôm nay"}: +${points}</p>
          ${!isTestData ? `<p>🏆 Tổng điểm: ${totalPoints}</p>` : ""}
        </div>
      `;
    }

    // Thêm thông tin về triệu chứng
    if (todayData.symptoms.length > 0) {
      content += `
        <div class="quit-tracking-symptoms-popup">
          <h4>🌟 Triệu chứng ${isTestData ? "mẫu" : "hôm nay"}:</h4>
          ${todayData.symptoms
            .map(
              (symptom) => `
            <div class="quit-tracking-symptom-item">
              <strong>${SYMPTOMS[symptom]}</strong>
              <p>${SYMPTOM_MESSAGES[symptom]}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    content += `
      <div class="quit-tracking-motivation-popup">
        <p><strong>💪 ${
          isTestData
            ? "Test hoàn tất!"
            : "Bạn đang làm rất tốt! Hãy tiếp tục kiên trì!"
        }</strong></p>
      </div>
    `;

    setPopupContent(content);
    setIsModalVisible(true);
  };

  // Kiểm tra có thể chỉnh sửa không - CẬP NHẬT LOGIC
  const canEdit = (date) => {
    // Nếu bật test mode, cho phép edit mọi ngày
    if (isTestMode) {
      return true;
    }

    // Logic cũ - chỉ cho phép edit hôm nay trước 22h
    const today = startOfDay(new Date());
    const targetDate = startOfDay(date);

    if (isSameDay(targetDate, today)) {
      const now = new Date();
      return now.getHours() < 22;
    }

    return false;
  };

  // Lấy dữ liệu của ngày được chọn
  const getSelectedDateData = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return trackingData[dateStr] || null;
  };

  // Hàm xóa dữ liệu test (chỉ hiện trong test mode)
  const clearTestData = () => {
    Modal.confirm({
      title: "🗑️ Xóa dữ liệu test",
      content:
        "Bạn có chắc muốn xóa tất cả dữ liệu test? Dữ liệu thật sẽ được giữ nguyên.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        let deletedCount = 0;
        const keysToRemove = [];

        // Tìm tất cả key của dữ liệu test
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`tracking_${accountId}_`)) {
            try {
              const data = JSON.parse(localStorage.getItem(key));
              if (data && data.isTestData === true) {
                keysToRemove.push(key);
              }
            } catch (e) {
              console.error("Lỗi parse dữ liệu:", e);
            }
          }
        });

        // Xóa các key đã tìm thấy
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
          deletedCount++;
        });

        // Cập nhật lại state
        loadTrackingData();

        // Reset form data nếu đang hiển thị dữ liệu test
        const currentDateStr = format(selectedDate, "yyyy-MM-dd");
        const currentData = JSON.parse(
          localStorage.getItem(`tracking_${accountId}_${currentDateStr}`) ||
            "null"
        );
        if (!currentData || currentData.isTestData) {
          setTodayData({
            cigarettes_smoked: "",
            symptoms: [],
            notes: "",
          });
        }

        if (deletedCount > 0) {
          message.success(`🧹 Đã xóa ${deletedCount} dữ liệu test!`);
        } else {
          message.info("ℹ️ Không tìm thấy dữ liệu test nào để xóa.");
        }
      },
    });
  };

  // Thêm hàm tính ngày kết thúc kế hoạch
  const getPlanEndDate = () => {
    if (!plan || !plan.stages || plan.stages.length === 0) return null;

    const startDate = new Date(plan.localDateTime);

    if (plan.systemPlan) {
      // Kế hoạch hệ thống: mỗi stage = 4 tuần = 28 ngày
      const totalStages = plan.stages.length;
      const totalDays = totalStages * 28;
      return addDays(startDate, totalDays - 1); // -1 vì ngày đầu tiên được tính
    } else {
      // Kế hoạch tự tạo: tính tổng số ngày từ tất cả các stage
      let totalDays = 0;
      for (const stage of plan.stages) {
        totalDays += parseWeekRangeToDays(stage.week_range);
      }
      return addDays(startDate, totalDays - 1);
    }
  };

  // Thêm hàm tính tổng số ngày của kế hoạch
  const getTotalPlanDays = () => {
    if (!plan || !plan.stages || plan.stages.length === 0) return 0;

    if (plan.systemPlan) {
      return plan.stages.length * 28;
    } else {
      let totalDays = 0;
      for (const stage of plan.stages) {
        totalDays += parseWeekRangeToDays(stage.week_range);
      }
      return totalDays;
    }
  };

  // Hàm kiểm tra ngày có trong kế hoạch không
  const isDateInPlan = (date) => {
    if (!plan) return false;

    const startDate = new Date(plan.localDateTime);
    const endDate = getPlanEndDate();

    return !isBefore(date, startDate) && (!endDate || !isAfter(date, endDate));
  };

  // Render calendar theo dạng lịch tháng
  const renderCalendar = () => {
    if (!plan) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Bắt đầu từ thứ 2
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    // Tạo các hàng của lịch (tuần)
    const calendarRows = [];
    let days = [];

    dateRange.forEach((date, index) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = trackingData[dateStr];
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      const isPast = isBefore(date, today);
      const isFuture = isAfter(date, today);
      const isCurrentMonth = getMonth(date) === getMonth(currentMonth);
      const isInPlan = isDateInPlan(date);

      days.push(
        <div
          key={dateStr}
          className={`
            quit-tracking-calendar-cell 
            ${isSelected ? "quit-tracking-cell-selected" : ""}
            ${isToday ? "quit-tracking-cell-today" : ""}
            ${!isCurrentMonth ? "quit-tracking-cell-other-month" : ""}
            ${!isInPlan ? "quit-tracking-cell-out-of-plan" : ""}
            ${isPast ? "quit-tracking-cell-past" : ""}
            ${isFuture ? "quit-tracking-cell-future" : ""}
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="quit-tracking-cell-number">{format(date, "d")}</div>

          {/* Hiển thị trạng thái */}
          {dayData && dayData.submitted && isInPlan && (
            <div
              className={`quit-tracking-cell-status ${
                dayData.cigarettes_smoked <= dayData.target
                  ? "quit-tracking-cell-success"
                  : "quit-tracking-cell-warning"
              }`}
            >
              {dayData.isTestData ? "🔧" : "✓"}
            </div>
          )}

          {/* Hiển thị stage indicator */}
          {isInPlan && (
            <div className="quit-tracking-cell-stage">
              {getCurrentStage(date)?.stageNumber || "-"}
            </div>
          )}
        </div>
      );

      // Tạo hàng mới sau mỗi 7 ngày
      if ((index + 1) % 7 === 0) {
        calendarRows.push(
          <div
            key={`week-${calendarRows.length}`}
            className="quit-tracking-calendar-row"
          >
            {days}
          </div>
        );
        days = [];
      }
    });

    const planStartDate = new Date(plan.localDateTime);
    const planEndDate = getPlanEndDate();

    return (
      <div className="quit-tracking-calendar-container">
        {/* Header với navigation */}
        <div className="quit-tracking-calendar-header">
          <div className="quit-tracking-calendar-nav">
            <Button
              type="text"
              icon={<span>‹</span>}
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            />
            <h3>{format(currentMonth, "MMMM yyyy", { locale: vi })}</h3>
            <Button
              type="text"
              icon={<span>›</span>}
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            />
          </div>

          <div className="quit-tracking-plan-summary">
            <span>📅 {format(planStartDate, "dd/MM/yyyy")}</span>
            {planEndDate && <span>🏁 {format(planEndDate, "dd/MM/yyyy")}</span>}
          </div>
        </div>

        {/* Thông tin legend */}
        <div className="quit-tracking-calendar-legend">
          <span className="quit-tracking-legend-today">Hôm nay</span>
          <span className="quit-tracking-legend-success">Hoàn thành</span>
          <span className="quit-tracking-legend-warning">Chưa đạt</span>
          <span className="quit-tracking-legend-out-plan">Ngoài kế hoạch</span>
          {isTestMode && (
            <span className="quit-tracking-legend-test">🔧 Test</span>
          )}
        </div>

        {/* Header ngày trong tuần */}
        <div className="quit-tracking-calendar-weekdays">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="quit-tracking-weekday-header">
              {day}
            </div>
          ))}
        </div>

        {/* Lịch tháng */}
        <div className="quit-tracking-calendar-grid">{calendarRows}</div>

        {/* Quick navigation */}
        <div className="quit-tracking-calendar-quick-nav">
          <Button
            size="small"
            type={isSameDay(currentMonth, new Date()) ? "primary" : "default"}
            onClick={() => setCurrentMonth(new Date())}
          >
            Tháng này
          </Button>
          <Button
            size="small"
            type={
              isSameDay(currentMonth, planStartDate) ? "primary" : "default"
            }
            onClick={() => setCurrentMonth(planStartDate)}
          >
            Tháng bắt đầu
          </Button>
          {planEndDate && (
            <Button
              size="small"
              type={
                isSameDay(currentMonth, planEndDate) ? "primary" : "default"
              }
              onClick={() => setCurrentMonth(planEndDate)}
            >
              Tháng kết thúc
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Debug function để kiểm tra dữ liệu test
  const debugTestData = () => {
    console.log("=== DEBUG TEST DATA ===");
    const testDataKeys = [];
    const realDataKeys = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`tracking_${accountId}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.isTestData === true) {
            testDataKeys.push(key);
            console.log("Test data:", key, data);
          } else {
            realDataKeys.push(key);
            console.log("Real data:", key, data);
          }
        } catch (e) {
          console.error("Lỗi parse dữ liệu:", key, e);
        }
      }
    });

    console.log(
      `Tổng có ${testDataKeys.length} dữ liệu test và ${realDataKeys.length} dữ liệu thật`
    );
    console.log("Test data keys:", testDataKeys);
    console.log("Real data keys:", realDataKeys);
    console.log("======================");
  };

  // Hàm đếm số lượng dữ liệu test
  const getTestDataCount = () => {
    let count = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`tracking_${accountId}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.isTestData === true) {
            count++;
          }
        } catch (e) {
          console.error("Lỗi parse dữ liệu:", e);
        }
      }
    });
    return count;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="quit-tracking-main-container">
          <div className="quit-tracking-loading-container">
            <div className="quit-tracking-loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <Navbar />
        <div className="quit-tracking-main-container">
          <div className="quit-tracking-error-container">
            <h3>Chưa có kế hoạch cai thuốc</h3>
            <p>Vui lòng tạo kế hoạch trước khi theo dõi tiến trình.</p>
            <Button
              type="primary"
              onClick={() => (window.location.href = "/planning")}
            >
              Tạo kế hoạch
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentStage = getCurrentStage(selectedDate);
  const selectedData = getSelectedDateData();
  const isEditable = canEdit(selectedDate);

  return (
    <>
      <Navbar />
      <div className="quit-tracking-main-container">
        <div className="quit-tracking-page-header">
          <h1>📊 Theo dõi tiến trình cai thuốc</h1>
          <div className="quit-tracking-plan-info">
            <Tag color={plan.systemPlan ? "blue" : "green"}>
              {plan.systemPlan ? "Kế hoạch hệ thống" : "Kế hoạch tự tạo"}
            </Tag>
            <Tag color="orange">
              Mức độ nghiện:{" "}
              {plan.addictionLevel === "LOW"
                ? "Thấp"
                : plan.addictionLevel === "MEDIUM"
                ? "Trung bình"
                : "Cao"}
            </Tag>
          </div>

          {/* Test Mode Toggle */}
          <div className="quit-tracking-test-controls">
            <div className="quit-tracking-test-toggle">
              <BugOutlined style={{ marginRight: 8 }} />
              <span>Chế độ Test: </span>
              <Switch
                checked={isTestMode}
                onChange={toggleTestMode}
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
              {isTestMode && (
                <>
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={clearTestData}
                    style={{ marginLeft: 8 }}
                  >
                    🧹 Xóa dữ liệu test
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={debugTestData}
                    style={{ marginLeft: 8 }}
                  >
                    🔍 Debug
                  </Button>
                </>
              )}
            </div>
            {isTestMode && (
              <div className="quit-tracking-test-notice">
                ℹ️ Đang ở chế độ Test - Có thể nhập dữ liệu cho mọi ngày để test
                giao diện
                <br />
                📊 Hiện có {getTestDataCount()} dữ liệu test
              </div>
            )}
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <Row gutter={[16, 16]} className="quit-tracking-stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Tổng số ngày"
                value={stats.totalDays}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Ngày hoàn thành"
                value={stats.completedDays}
                prefix={<SmileOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Tổng điểm"
                value={stats.totalPoints}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Tiến độ trung bình"
                value={stats.averageProgress}
                suffix="%"
                prefix={<HeartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Calendar */}
        {renderCalendar()}

        {/* Form nhập liệu */}
        <Card
          className="quit-tracking-form-card"
          title={`📝 Nhập dữ liệu ngày ${format(selectedDate, "dd/MM/yyyy")} ${
            selectedData?.isTestData ? "(Test)" : ""
          }`}
        >
          {currentStage && (
            <div className="quit-tracking-stage-info">
              <Tag color="blue">Giai đoạn {currentStage.stageNumber}</Tag>
              <span>Mục tiêu: {currentStage.targetCigarettes} điếu/ngày</span>
              {isTestMode && !isSameDay(selectedDate, new Date()) && (
                <Tag color="red">CHẾ ĐỘ TEST</Tag>
              )}
            </div>
          )}

          {selectedData && selectedData.submitted ? (
            <div className="quit-tracking-submitted-data">
              <h4>
                ✅ Dữ liệu đã lưu{selectedData.isTestData ? " (Test)" : ""}:
              </h4>
              <p>
                <strong>Số điếu đã hút:</strong>{" "}
                {selectedData.cigarettes_smoked}
              </p>
              <p>
                <strong>Mục tiêu:</strong> {selectedData.target} điếu
              </p>
              <p>
                <strong>Điểm:</strong> {selectedData.points}
              </p>
              {selectedData.symptoms && selectedData.symptoms.length > 0 && (
                <div>
                  <strong>Triệu chứng:</strong>
                  {selectedData.symptoms.map((symptom) => (
                    <Tag key={symptom} color="orange">
                      {SYMPTOMS[symptom]}
                    </Tag>
                  ))}
                </div>
              )}
              {isEditable && (
                <Button
                  type="primary"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setTodayData({
                      cigarettes_smoked:
                        selectedData.cigarettes_smoked.toString(),
                      symptoms: selectedData.symptoms || [],
                      notes: selectedData.notes || "",
                    });
                  }}
                >
                  ✏️ Chỉnh sửa
                </Button>
              )}
            </div>
          ) : isEditable ? (
            <div className="quit-tracking-input-form">
              <div className="quit-tracking-form-group">
                <label>Số điếu thuốc đã hút:</label>
                <input
                  type="number"
                  min="0"
                  value={todayData.cigarettes_smoked}
                  onChange={(e) =>
                    handleInputChange("cigarettes_smoked", e.target.value)
                  }
                  placeholder="Nhập số điếu"
                  className="quit-tracking-form-input"
                />
              </div>

              <div className="quit-tracking-form-group">
                <label>Triệu chứng gặp phải:</label>
                <div className="quit-tracking-symptoms-grid">
                  {Object.entries(SYMPTOMS).map(([key, label]) => (
                    <label key={key} className="quit-tracking-symptom-checkbox">
                      <input
                        type="checkbox"
                        checked={todayData.symptoms.includes(key)}
                        onChange={(e) =>
                          handleSymptomChange(key, e.target.checked)
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="quit-tracking-form-group">
                <label>Ghi chú (tùy chọn):</label>
                <textarea
                  value={todayData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú về cảm xúc, hoạt động..."
                  className="quit-tracking-form-textarea"
                />
              </div>

              <div className="quit-tracking-form-actions">
                <Button
                  type="primary"
                  size="large"
                  loading={submitting}
                  onClick={handleSubmit}
                  disabled={!todayData.cigarettes_smoked}
                >
                  💾{" "}
                  {isTestMode && !isSameDay(selectedDate, new Date())
                    ? "Lưu dữ liệu test"
                    : "Lưu dữ liệu hôm nay"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="quit-tracking-cannot-edit">
              <p>⏰ Không thể chỉnh sửa dữ liệu này</p>
              <p>Chỉ có thể nhập dữ liệu hôm nay và trước 22:00</p>
              <p>💡 Bật chế độ Test để test với mọi ngày</p>
            </div>
          )}
        </Card>

        {/* Modal popup */}
        <Modal
          title="📣 Kết quả hôm nay"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key="close"
              type="primary"
              onClick={() => setIsModalVisible(false)}
            >
              Đóng
            </Button>,
          ]}
          width={600}
          centered
          className="quit-tracking-result-modal"
        >
          <div
            className="quit-tracking-popup-content"
            dangerouslySetInnerHTML={{ __html: popupContent }}
          />
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default TrackingPage;
