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
  const [isTestMode, setIsTestMode] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const BOOKING_LINK = "http://localhost:5173/booking";

  // Thêm 2 hàm thiếu này vào sau hàm canEdit
  const handleInputChange = (field, value) => {
    setTodayData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSymptomChange = (symptom, checked) => {
    setTodayData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  // Parse week range thành số ngày
  const parseWeekRangeToDays = (weekRange) => {
    if (!weekRange || typeof weekRange !== "string") return 7;

    const cleanRange = weekRange.trim();
    const rangeMatch = cleanRange.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const startWeek = parseInt(rangeMatch[1]);
      const endWeek = parseInt(rangeMatch[2]);
      return Math.max(1, endWeek - startWeek + 1) * 7;
    }

    const numberMatch = cleanRange.match(/^(\d+)$/);
    if (numberMatch) {
      return 7;
    }

    return 7;
  };

  // Lấy stage hiện tại dựa trên ngày
  const getCurrentStage = (date) => {
    if (!plan || !plan.stages) return null;

    const planStartDate = new Date(plan.localDateTime);
    const daysDiff = differenceInDays(date, planStartDate);

    if (plan.systemPlan) {
      const stageIndex = Math.floor(daysDiff / 28);
      return plan.stages[stageIndex] || plan.stages[plan.stages.length - 1];
    } else {
      // Kế hoạch tự tạo: xử lý theo từng week_range riêng biệt
      if (daysDiff < 0) return null;

      let currentDayCount = 0;

      // Sort stages theo week_range để đảm bảo thứ tự đúng
      const sortedStages = [...plan.stages].sort((a, b) => {
        const aStart = parseInt(a.week_range.split("-")[0]);
        const bStart = parseInt(b.week_range.split("-")[0]);
        return aStart - bStart;
      });

      for (const stage of sortedStages) {
        const stageDays = parseWeekRangeToDays(stage.week_range);

        if (
          daysDiff >= currentDayCount &&
          daysDiff < currentDayCount + stageDays
        ) {
          return {
            id: stage.id,
            stageNumber: stage.stageNumber,
            targetCigarettes: stage.targetCigarettes,
            week_range: stage.week_range,
            reductionPercentage: stage.reductionPercentage,
            quitPlanId: stage.quitPlanId,
          };
        }

        currentDayCount += stageDays;
      }

      // Nếu vượt quá kế hoạch, trả về stage cuối cùng
      const lastStage = sortedStages[sortedStages.length - 1];
      if (lastStage) {
        return {
          id: lastStage.id,
          stageNumber: lastStage.stageNumber,
          targetCigarettes: lastStage.targetCigarettes,
          week_range: lastStage.week_range,
          reductionPercentage: lastStage.reductionPercentage,
          quitPlanId: lastStage.quitPlanId,
        };
      }
    }

    return null;
  };

  // Tính ngày kết thúc kế hoạch
  const getPlanEndDate = () => {
    if (!plan || !plan.stages || plan.stages.length === 0) return null;

    const startDate = new Date(plan.localDateTime);

    if (plan.systemPlan) {
      const totalStages = plan.stages.length;
      const totalDays = totalStages * 28;
      return addDays(startDate, totalDays - 1);
    } else {
      let totalDays = 0;

      // Sort stages theo week_range để tính đúng
      const sortedStages = [...plan.stages].sort((a, b) => {
        const aStart = parseInt(a.week_range.split("-")[0]);
        const bStart = parseInt(b.week_range.split("-")[0]);
        return aStart - bStart;
      });

      for (const stage of sortedStages) {
        if (stage.week_range) {
          totalDays += parseWeekRangeToDays(stage.week_range);
        }
      }

      return totalDays > 0 ? addDays(startDate, totalDays - 1) : null;
    }
  };

  // Kiểm tra ngày có trong kế hoạch không
  const isDateInPlan = (date) => {
    if (!plan) return false;

    const startDate = new Date(plan.localDateTime);
    const endDate = getPlanEndDate();

    return !isBefore(date, startDate) && (!endDate || !isAfter(date, endDate));
  };

  // Lấy dữ liệu của ngày được chọn
  const getSelectedDateData = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return trackingData[dateStr] || null;
  };

  // Kiểm tra có thể chỉnh sửa không
  const canEdit = (date) => {
    if (isTestMode) return true;

    const today = startOfDay(new Date());
    const targetDate = startOfDay(date);

    if (isSameDay(targetDate, today)) {
      const now = new Date();
      return now.getHours() < 22;
    }

    return false;
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

  // Kiểm tra triệu chứng thường xuyên
  const checkFrequentSymptoms = (dayKey, smoked, targetCigs) => {
    const symptomsToday = todayData.symptoms || [];
    const checkedSymptoms = symptomsToday.filter((symptom) => symptom);

    if (checkedSymptoms.length >= 3) {
      return {
        hasFrequentSymptoms: true,
        content: `<div style="margin: 12px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
          <strong>🌟 Bạn đang gặp nhiều triệu chứng hôm nay</strong><br/>
          Chúng tôi hiểu rằng việc cai thuốc có thể khiến bạn cảm thấy khó chịu. Những triệu chứng này là hoàn toàn bình thường và cho thấy cơ thể đang điều chỉnh để thích nghi với việc không có nicotine.<br/><br/>
          <strong>💡 Đừng lo lắng:</strong> Hầu hết các triệu chứng sẽ giảm dần trong vài tuần tới. Hãy nhớ rằng mỗi ngày bạn kiên trì là một bước tiến lớn cho sức khỏe!<br/><br/>
          Nếu bạn cảm thấy cần hỗ trợ thêm, đừng ngần ngại <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với chuyên gia</a> của chúng tôi.<br/><br/>
          <strong>🎯 Bạn đang làm rất tốt! Hãy tiếp tục kiên trì nhé! 💪</strong>
        </div>`,
      };
    }

    return { hasFrequentSymptoms: false, content: "" };
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

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const bookingCheck = checkFrequentSymptoms(dateStr, smoked, target);
    if (bookingCheck.hasFrequentSymptoms) {
      content += bookingCheck.content;
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
      const isToday = isSameDay(selectedDate, new Date());

      if (!isTestMode || isToday) {
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

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const trackingEntry = {
        ...todayData,
        cigarettes_smoked,
        target: currentStage.targetCigarettes,
        points,
        submitted: true,
        submittedAt: new Date().toISOString(),
        stageId: currentStage.id,
        isTestData: isTestMode && !isToday,
      };

      localStorage.setItem(
        `tracking_${accountId}_${dateStr}`,
        JSON.stringify(trackingEntry)
      );

      const newTrackingData = {
        ...trackingData,
        [dateStr]: trackingEntry,
      };
      setTrackingData(newTrackingData);
      calculateStats(newTrackingData);

      if (!isTestMode || isToday) {
        const currentTotal = parseInt(
          localStorage.getItem(`total_points_${accountId}`) || "0"
        );
        const newTotal = currentTotal + points;
        localStorage.setItem(`total_points_${accountId}`, newTotal.toString());
      }

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

  // Xóa dữ liệu test
  const clearTestData = () => {
    Modal.confirm({
      title: "🗑️ Xóa tất cả dữ liệu test",
      content: "Bạn có chắc muốn xóa tất cả dữ liệu test?",
      okText: "Xóa hết",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        let deletedCount = 0;
        const keysToDelete = [];

        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`tracking_${accountId}_`)) {
            try {
              const data = JSON.parse(localStorage.getItem(key));
              if (data && data.isTestData === true) {
                keysToDelete.push(key);
                deletedCount++;
              }
            } catch (e) {
              console.error("Lỗi parse dữ liệu:", e);
            }
          }
        });

        keysToDelete.forEach((key) => {
          localStorage.removeItem(key);
        });

        loadTrackingData();

        const currentDateStr = format(selectedDate, "yyyy-MM-dd");
        if (keysToDelete.includes(`tracking_${accountId}_${currentDateStr}`)) {
          setTodayData({
            cigarettes_smoked: "",
            symptoms: [],
            notes: "",
          });
        }

        if (deletedCount > 0) {
          message.success(`🧹 Đã xóa ${deletedCount} dữ liệu test!`);
        } else {
          message.info("📝 Không tìm thấy dữ liệu test nào để xóa.");
        }
      },
    });
  };

  // Xóa tất cả dữ liệu
  const clearAllData = () => {
    Modal.confirm({
      title: "⚠️ Xóa TẤT CẢ dữ liệu",
      content:
        "CẢNH BÁO: Điều này sẽ xóa TẤT CẢ dữ liệu theo dõi (cả test và thật).",
      okText: "XÓA TẤT CẢ",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        let deletedCount = 0;
        const keysToDelete = [];

        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`tracking_${accountId}_`)) {
            keysToDelete.push(key);
            deletedCount++;
          }
        });

        keysToDelete.forEach((key) => {
          localStorage.removeItem(key);
        });

        localStorage.removeItem(`total_points_${accountId}`);

        setTrackingData({});
        setTodayData({
          cigarettes_smoked: "",
          symptoms: [],
          notes: "",
        });
        calculateStats({});

        if (deletedCount > 0) {
          message.success(`🗑️ Đã xóa TẤT CẢ ${deletedCount} dữ liệu!`);
        } else {
          message.info("📝 Không có dữ liệu nào để xóa.");
        }
      },
    });
  };

  // Bỏ debug function phức tạp, giữ đơn giản
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

  // Sửa toggle test mode đơn giản hơn
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
        let planData = response.data;

        // Nếu là kế hoạch tự tạo, lấy thêm stages từ API riêng
        if (!planData.systemPlan && planData.id) {
          try {
            const stagesResponse = await api.get(
              `/v1/customers/${accountId}/quit-plans/${planData.id}/stages`
            );
            if (stagesResponse.data && stagesResponse.data.length > 0) {
              // Gán stages vào planData
              planData.stages = stagesResponse.data;
              console.log(
                "📊 Đã lấy stages cho kế hoạch tự tạo:",
                stagesResponse.data
              );
            }
          } catch (stagesError) {
            console.error("Lỗi lấy stages:", stagesError);
            message.error("Không thể tải chi tiết kế hoạch tự tạo.");
          }
        }

        setPlan(planData);
        console.log("📋 Kế hoạch đã load:", planData);
        return planData;
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
          const data = JSON.parse(localStorage.getItem(key));
          if (data) {
            savedData[dateStr] = data;
          }
        } catch (e) {
          console.error("Lỗi parse dữ liệu:", e);
        }
      }
    });

    setTrackingData(savedData);
    calculateStats(savedData);
    console.log("📊 Đã load lại dữ liệu tracking:", savedData);
  };

  // Tính toán thống kê (không bao gồm dữ liệu test)
  const calculateStats = (data) => {
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

  useEffect(() => {
    if (accountId) {
      initializeData();
    } else {
      message.error("Vui lòng đăng nhập để xem trang theo dõi.");
    }
  }, [accountId]);

  useEffect(() => {
    loadSelectedDateData();
  }, [selectedDate, trackingData]);

  // Debug log
  useEffect(() => {
    if (plan && !plan.systemPlan) {
      console.log("🔍 Kế hoạch tự tạo:", plan);
      console.log("📊 Stages:", plan.stages);

      // Sort để kiểm tra thứ tự
      const sortedStages = [...plan.stages].sort((a, b) => {
        const aStart = parseInt(a.week_range.split("-")[0]);
        const bStart = parseInt(b.week_range.split("-")[0]);
        return aStart - bStart;
      });
      console.log("📊 Stages sorted:", sortedStages);

      // Test getCurrentStage với một vài ngày
      const planStartDate = new Date(plan.localDateTime);
      const testDates = [
        planStartDate, // Ngày đầu tiên
        addDays(planStartDate, 14), // Ngày 15 (tuần 3-4)
        addDays(planStartDate, 28), // Ngày 29 (tuần 5-6)
        addDays(planStartDate, 42), // Ngày 43 (tuần 7-8)
        addDays(planStartDate, 56), // Ngày 57 (tuần 9-10)
      ];

      console.log("📅 Test các ngày:");
      testDates.forEach((testDate, index) => {
        const stage = getCurrentStage(testDate);
        console.log(
          `  ${format(testDate, "dd/MM/yyyy")} (ngày ${
            differenceInDays(testDate, planStartDate) + 1
          }):`,
          stage?.week_range,
          stage?.targetCigarettes
        );
      });
    }
  }, [plan]);

  // Render Calendar
  const renderCalendar = () => {
    if (!plan) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();

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

          {/* CHỈ hiển thị trạng thái hoàn thành - BỎ HẾT BADGE */}
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
        </div>
      );

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
            <span className="quit-tracking-plan-type">
              {plan.systemPlan ? "🏥 Hệ thống" : "👤 Tự tạo"}
            </span>
          </div>
        </div>

        <div className="quit-tracking-calendar-legend">
          <span className="quit-tracking-legend-today">Hôm nay</span>
          <span className="quit-tracking-legend-success">Hoàn thành</span>
          <span className="quit-tracking-legend-warning">Chưa đạt</span>
          <span className="quit-tracking-legend-out-plan">Ngoài kế hoạch</span>
          {isTestMode && (
            <span className="quit-tracking-legend-test">🔧 Test</span>
          )}
        </div>

        <div className="quit-tracking-calendar-weekdays">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="quit-tracking-weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="quit-tracking-calendar-grid">{calendarRows}</div>

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
                    danger
                    size="small"
                    onClick={clearAllData}
                    style={{ marginLeft: 8 }}
                  >
                    🗑️ Xóa TẤT CẢ
                  </Button>
                </>
              )}
            </div>
            {isTestMode && (
              <div className="quit-tracking-test-notice">
                ℹ️ Đang ở chế độ Test - Có thể nhập dữ liệu cho mọi ngày để test
                giao diện
                <br />
                📊 Hiện có {getTestDataCount()} dữ liệu test | 📝 Tổng dữ liệu:{" "}
                {Object.keys(trackingData).length}
              </div>
            )}
          </div>
        </div>

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

        {renderCalendar()}

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
              {!plan.systemPlan && currentStage.week_range && (
                <Tag color="green">{currentStage.week_range}</Tag>
              )}
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
                <div style={{ marginTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setTodayData({
                        cigarettes_smoked:
                          selectedData.cigarettes_smoked.toString(),
                        symptoms: selectedData.symptoms || [],
                        notes: selectedData.notes || "",
                      });
                    }}
                    style={{ marginRight: 8 }}
                  >
                    ✏️ Chỉnh sửa
                  </Button>
                  {selectedData.isTestData && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        const dateStr = format(selectedDate, "yyyy-MM-dd");
                        localStorage.removeItem(
                          `tracking_${accountId}_${dateStr}`
                        );
                        loadTrackingData();
                        setTodayData({
                          cigarettes_smoked: "",
                          symptoms: [],
                          notes: "",
                        });
                        message.success("🗑️ Đã xóa dữ liệu test của ngày này!");
                      }}
                    >
                      🗑️ Xóa ngày này
                    </Button>
                  )}
                </div>
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
          width={700}
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
