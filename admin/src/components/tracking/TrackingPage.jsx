import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { format } from "date-fns";
import { Modal } from "antd";
import "./TrackingPage.css";

const SYMPTOMS = [
  "Thèm thuốc lá",
  "Thèm ăn",
  "Ho dai dẳng",
  "Triệu chứng cảm cúm",
  "Thay đổi tâm trạng",
  "Táo bón",
];

const SYMPTOM_MESSAGES = {
  "Thèm thuốc lá": `Thèm thuốc là triệu chứng bình thường khi bạn đang cai thuốc, thường xuất hiện trong vài giờ và kéo dài vài tuần. Đây là dấu hiệu cho thấy cơ thể đang thích nghi với việc thiếu nicotin. Hãy thử nhai kẹo cao su hoặc đi dạo để làm dịu cảm giác này.
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
  "Thèm ăn": `Nicotin giúp điều chỉnh đường huyết, nên khi cai thuốc, bạn sẽ cảm thấy thèm ăn hơn. Điều này có thể dẫn đến tăng cân nhẹ, đặc biệt trong 3 tháng đầu. Bạn hãy duy trì chế độ ăn lành mạnh và vận động thường xuyên để kiểm soát cân nặng nhé!
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
  "Ho dai dẳng": `Đừng lo nếu bạn ho nhiều hơn – đó là dấu hiệu tốt! Phổi bạn đang dần phục hồi và làm sạch các chất độc tồn đọng. Hãy uống nhiều nước và thử dùng mật ong hoặc trà ấm để dịu họng.
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
  "Triệu chứng cảm cúm": `Bạn có thể thấy hơi sốt, khó chịu hoặc nghẹt mũi – đừng lo! Đây là phản ứng tự nhiên của cơ thể khi không còn nicotin. Triệu chứng này thường chỉ kéo dài 1 ngày.
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
  "Thay đổi tâm trạng": `Bạn có thể cảm thấy cáu gắt hoặc buồn bực – đây là phản ứng phổ biến khi cơ thể thiếu dopamine. Hãy thử thư giãn, đi bộ, trò chuyện với bạn bè hoặc tránh caffeine để ổn định cảm xúc.
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
  "Táo bón": `Cai thuốc có thể làm chậm tiêu hóa, dẫn đến táo bón trong khoảng 1–2 tuần đầu. Bạn nên uống đủ nước và ăn nhiều rau xanh, thực phẩm giàu chất xơ để cải thiện tình trạng này.
Bạn đang làm rất tốt – hãy tiếp tục kiên trì! 💪
`,
};

const TrackingPage = () => {
  const accountId = localStorage.getItem("accountId");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({ stage: null, week: null });
  const [trackingData, setTrackingData] = useState({});
  const [editingDays, setEditingDays] = useState({});
  const [popupContent, setPopupContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const BOOKING_LINK = "http://localhost:5173/booking";
  const isTestMode = true;

  useEffect(() => {
    async function fetchPlan() {
      try {
        // Lấy thông tin kế hoạch cơ bản
        const planRes = await api.get(`/v1/customers/${accountId}/quit-plans`);
        const planResult = Array.isArray(planRes.data)
          ? planRes.data[planRes.data.length - 1]
          : planRes.data;

        if (!planResult) {
          alert("Không tìm thấy kế hoạch nào. Vui lòng tạo kế hoạch trước.");
          setLoading(false);
          return;
        }

        // Nếu là kế hoạch tự tạo (systemPlan = false), lấy stages từ API
        if (planResult && !planResult.systemPlan) {
          try {
            const stagesRes = await api.get(
              `/v1/customers/${accountId}/quit-plans/${planResult.id}/stages`
            );

            if (stagesRes.data && stagesRes.data.length > 0) {
              // Tổ chức lại data từ stages API thành format phù hợp cho kế hoạch tự tạo
              const organizedStages = organizeCustomStages(stagesRes.data);
              setPlan({
                ...planResult,
                stages: organizedStages,
                isCustomPlan: true,
              });
            } else {
              alert(
                "Kế hoạch chưa được hoàn thiện. Vui lòng hoàn tất việc tạo kế hoạch."
              );
              setLoading(false);
              return;
            }
          } catch (stageError) {
            console.error("Lỗi khi lấy stages:", stageError);
            alert("Không thể tải chi tiết kế hoạch. Vui lòng thử lại.");
            setLoading(false);
            return;
          }
        } else {
          // Kế hoạch hệ thống, sử dụng cấu trúc mặc định
          setPlan({
            ...planResult,
            isCustomPlan: false,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy kế hoạch:", error);
        alert("Không lấy được kế hoạch. Vui lòng kiểm tra kết nối và thử lại.");
        setLoading(false);
      }
    }

    if (accountId) {
      fetchPlan();
      loadSavedData();
    } else {
      alert("Vui lòng đăng nhập để xem kế hoạch.");
      setLoading(false);
    }
  }, [accountId]);

  // Tổ chức stages từ kế hoạch tự tạo thành format phù hợp
  const organizeCustomStages = (stagesData) => {
    if (!stagesData || stagesData.length === 0) return [];

    // Group stages by stageNumber
    const stageGroups = {};
    stagesData.forEach((stage) => {
      const stageNum = stage.stageNumber;
      if (!stageGroups[stageNum]) {
        stageGroups[stageNum] = {
          stageNumber: stageNum,
          periods: [], // Mỗi period là một dòng trong CreatePlanning (week_range + targetCigarettes)
        };
      }
      stageGroups[stageNum].periods.push({
        week_range: stage.week_range,
        targetCigarettes: stage.targetCigarettes,
        id: stage.id,
      });
    });

    // Convert to tracking format với structure linh hoạt
    return Object.keys(stageGroups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((stageNum) => {
        const stageGroup = stageGroups[stageNum];

        return {
          stageNumber: parseInt(stageNum),
          periods: stageGroup.periods, // Giữ nguyên periods cho custom plan
          isCustomStage: true,
        };
      });
  };

  // Parse week range string để tạo ra các tuần thực tế
  const parseWeekRange = (weekRange) => {
    if (!weekRange) return [1];

    // Các pattern có thể: "Tuần 1-4", "Tuần 1 đến tuần 4", "1-4", "Tuần 2-3"
    const patterns = [
      /tuần\s*(\d+)\s*-\s*(\d+)/i,
      /tuần\s*(\d+)\s*đến\s*tuần\s*(\d+)/i,
      /(\d+)\s*-\s*(\d+)/,
      /tuần\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = weekRange.match(pattern);
      if (match) {
        const start = parseInt(match[1]);
        const end = match[2] ? parseInt(match[2]) : start;

        const weeks = [];
        for (let i = start; i <= end; i++) {
          weeks.push(i);
        }
        return weeks;
      }
    }

    // Fallback: tìm số đầu tiên
    const fallbackMatch = weekRange.match(/(\d+)/);
    return fallbackMatch ? [parseInt(fallbackMatch[1])] : [1];
  };

  const loadSavedData = () => {
    const saved = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`track-${accountId}`)) {
        saved[key.replace(`track-${accountId}-`, "")] = JSON.parse(
          localStorage.getItem(key)
        );
      }
    });
    setTrackingData(saved);
  };

  const handleInput = (dayKey, field, value) => {
    const newData = {
      ...trackingData[dayKey],
      [field]: value,
    };
    setTrackingData((prev) => ({ ...prev, [dayKey]: newData }));
  };

  const handleSymptomToggle = (dayKey, symptom) => {
    const currentSymptoms = trackingData[dayKey]?.symptoms || {};
    handleInput(dayKey, "symptoms", {
      ...currentSymptoms,
      [symptom]: !currentSymptoms[symptom],
    });
  };

  const generatePopupContent = (dayKey, smoked, targetCigs) => {
    let content = "";

    const savedCigs = Math.max(targetCigs - parseInt(smoked), 0);
    const moneySaved = savedCigs * 1000;

    // Kết quả chính
    if (smoked <= targetCigs) {
      content += `<div class="popup-success">
        Hoàn thành mục tiêu hôm nay!<br/>
        Tiết kiệm: ${moneySaved.toLocaleString()} VND
      </div>`;
    } else {
      content += `<div class="popup-warning">
        Hôm nay bạn đã hút nhiều hơn kế hoạch được đề ra.<br/>
        Hãy cố gắng hơn ngày mai!
      </div>`;
    }

    const symptomsToday = trackingData[dayKey]?.symptoms || {};
    const checkedSymptoms = Object.entries(symptomsToday)
      .filter(([_, checked]) => checked)
      .map(([symptom]) => symptom);

    // Triệu chứng nhiều
    if (checkedSymptoms.length >= 3) {
      content += `<div style="margin: 12px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
        <strong>🌟 Bạn đang gặp nhiều triệu chứng hôm nay</strong><br/>
        Chúng tôi hiểu rằng việc cai thuốc có thể khiến bạn cảm thấy khó chịu. Những triệu chứng này là hoàn toàn bình thường và cho thấy cơ thể đang điều chỉnh để thích nghi với việc không có nicotine.<br/><br/>
        <strong>💡 Đừng lo lắng:</strong> Hầu hết các triệu chứng sẽ giảm dần trong vài tuần tới. Hãy nhớ rằng mỗi ngày bạn kiên trì là một bước tiến lớn cho sức khỏe!<br/><br/>
        Nếu bạn cảm thấy cần hỗ trợ thêm, đừng ngần ngại <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với chuyên gia</a> của chúng tôi.<br/><br/>
        <strong>🎯 Bạn đang làm rất tốt! Hãy tiếp tục kiên trì nhé! 💪</strong>
      </div>`;
    } else if (checkedSymptoms.length > 0) {
      checkedSymptoms.forEach((symptom) => {
        content += `<div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
          <strong>${symptom}</strong><br/>
          <small style="color: #666;">${SYMPTOM_MESSAGES[symptom]}</small>
        </div>`;
      });
    }

    // Cảnh báo triệu chứng kéo dài
    const dayKeys = Object.keys(trackingData).sort((a, b) => {
      const [s1, w1, d1] = a.split("-").map(Number);
      const [s2, w2, d2] = b.split("-").map(Number);
      return s1 * 100 + w1 * 10 + d1 - (s2 * 100 + w2 * 10 + d2);
    });

    checkedSymptoms.forEach((symptom) => {
      let consecutive = 0;
      for (let i = dayKeys.length - 1; i >= 0; i--) {
        const symList = Object.keys(
          trackingData[dayKeys[i]]?.symptoms || {}
        ).filter((s) => trackingData[dayKeys[i]]?.symptoms?.[s]);

        if (symList.includes(symptom)) {
          consecutive++;
        } else if (symList.length > 0) {
          break;
        }
      }

      if (consecutive >= 3) {
        content += `<div style="margin: 12px 0; padding: 12px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
          <strong>📌 Chú ý: Triệu chứng "${symptom}" kéo dài</strong><br/>
          Chúng tôi nhận thấy triệu chứng này đã xuất hiện liên tiếp ${consecutive} ngày. Mặc dù đây có thể là phần của quá trình cai thuốc, nhưng chúng tôi khuyến nghị bạn nên tham khảo ý kiến chuyên gia để được hỗ trợ tốt nhất.<br/><br/>
          <strong>🩺 Lời khuyên:</strong> Hãy <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với bác sĩ</a> để được đánh giá và tư vấn cách giảm thiểu triệu chứng này một cách hiệu quả.<br/><br/>
          <em>Sức khỏe của bạn là ưu tiên hàng đầu! 🌟</em>
        </div>`;
      }
    });

    return content;
  };

  // Thêm hàm tính điểm
  const calculatePoints = (smoked, targetCigs) => {
    let points = 0;

    // Điểm cơ bản cho việc ghi nhận
    points += 10;

    // Bonus nếu hoàn thành mục tiêu
    if (parseInt(smoked) <= targetCigs) {
      points += 50;

      // Bonus thêm nếu hút ít hơn mục tiêu
      const saved = targetCigs - parseInt(smoked);
      points += saved * 5;
    } else {
      // Trừ điểm nếu vượt mục tiêu
      const excess = parseInt(smoked) - targetCigs;
      points = Math.max(5, points - excess * 3);
    }

    return points;
  };

  // Sửa lại hàm saveData
  const saveData = (dayKey, smoked, targetCigs) => {
    const data = trackingData[dayKey];

    // Tính điểm cho ngày này
    const earnedPoints = calculatePoints(smoked, targetCigs);

    const updatedData = {
      ...data,
      target: targetCigs,
      smoked: parseInt(smoked),
      points: earnedPoints,
      submitted: true,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `track-${accountId}-${dayKey}`,
      JSON.stringify(updatedData)
    );

    // Cập nhật tổng điểm của user
    const currentTotal = parseInt(
      localStorage.getItem(`user-total-points-${accountId}`) || "0"
    );
    const newTotal = currentTotal + earnedPoints;
    localStorage.setItem(`user-total-points-${accountId}`, newTotal.toString());

    // Lấy tên user từ localStorage
    // Cách khác - tìm tất cả keys có chứa thông tin user
    const getUserName = () => {
      console.log("=== Searching for user name ===");
      console.log("accountId:", accountId);

      // Duyệt qua TẤT CẢ localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // Tìm key có chứa cả "username" và "fullName" trong value
        if (
          value &&
          value.includes('"username"') &&
          value.includes('"fullName"')
        ) {
          try {
            const userData = JSON.parse(value);
            console.log(`Found user data in "${key}":`, userData);

            // Kiểm tra xem có phải user hiện tại không (nếu có id)
            if (userData.id && userData.id.toString() === accountId) {
              console.log("✅ This is current user!");

              if (userData.username && userData.username !== "null") {
                console.log("Using username:", userData.username);
                return userData.username;
              }
              if (userData.fullName && userData.fullName !== "null") {
                console.log("Using fullName:", userData.fullName);
                return userData.fullName;
              }
            }

            // Nếu không có id hoặc không khớp, vẫn thử lấy tên
            if (userData.username && userData.username !== "null") {
              console.log("Using username (no id match):", userData.username);
              return userData.username;
            }
            if (userData.fullName && userData.fullName !== "null") {
              console.log("Using fullName (no id match):", userData.fullName);
              return userData.fullName;
            }
          } catch (e) {
            console.log(`Error parsing ${key}:`, e);
          }
        }
      }

      console.log("❌ No user name found, using fallback");
      return `User ${accountId}`;
    };

    const userName = getUserName();
    localStorage.setItem(`user-name-${accountId}`, userName);

    console.log("Saved user name:", userName, "for accountId:", accountId); // Log để kiểm tra

    // Lưu thông báo với điểm số
    const noteList = JSON.parse(
      localStorage.getItem(`notifications-${accountId}`) || "[]"
    );
    noteList.push({
      date: new Date().toISOString(),
      dayKey,
      points: earnedPoints,
      totalPoints: newTotal,
      message:
        parseInt(smoked) <= targetCigs
          ? `🎉 Bạn đã hoàn thành mục tiêu cai thuốc hôm nay! (+${earnedPoints} điểm)`
          : `⚠️ Bạn hút nhiều hơn kế hoạch hôm nay! (+${earnedPoints} điểm)`,
    });
    localStorage.setItem(
      `notifications-${accountId}`,
      JSON.stringify(noteList)
    );

    // Cập nhật popup để hiển thị điểm
    const popupText = generatePopupContentWithPoints(
      dayKey,
      smoked,
      targetCigs,
      earnedPoints,
      newTotal
    );
    setPopupContent(popupText);
    setIsModalVisible(true);

    setEditingDays((prev) => ({ ...prev, [dayKey]: false }));
  };

  // Thêm hàm generatePopupContentWithPoints
  const generatePopupContentWithPoints = (
    dayKey,
    smoked,
    targetCigs,
    earnedPoints,
    totalPoints
  ) => {
    let content = "";

    const savedCigs = Math.max(targetCigs - parseInt(smoked), 0);
    const moneySaved = savedCigs * 1000;

    // Kết quả chính với điểm số
    if (parseInt(smoked) <= targetCigs) {
      content += `<div class="popup-success">
      🎉 Hoàn thành mục tiêu hôm nay!<br/>
      💰 Tiết kiệm: ${moneySaved.toLocaleString()} VND<br/>
      ⭐ Điểm hôm nay: +${earnedPoints} điểm<br/>
      🏆 Tổng điểm: ${totalPoints} điểm
    </div>`;
    } else {
      content += `<div class="popup-warning">
      ⚠️ Hôm nay bạn đã hút nhiều hơn kế hoạch.<br/>
      ⭐ Điểm hôm nay: +${earnedPoints} điểm<br/>
      🏆 Tổng điểm: ${totalPoints} điểm<br/>
      Hãy cố gắng hơn ngày mai!
    </div>`;
    }

    const symptomsToday = trackingData[dayKey]?.symptoms || {};
    const checkedSymptoms = Object.entries(symptomsToday)
      .filter(([_, checked]) => checked)
      .map(([symptom]) => symptom);

    if (checkedSymptoms.length >= 3) {
      content += `<div style="margin: 12px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
        <strong>🌟 Bạn đang gặp nhiều triệu chứng hôm nay</strong><br/>
        Chúng tôi hiểu rằng việc cai thuốc có thể khiến bạn cảm thấy khó chịu. Những triệu chứng này là hoàn toàn bình thường và cho thấy cơ thể đang điều chỉnh để thích nghi với việc không có nicotine.<br/><br/>
        <strong>💡 Đừng lo lắng:</strong> Hầu hết các triệu chứng sẽ giảm dần trong vài tuần tới. Hãy nhớ rằng mỗi ngày bạn kiên trì là một bước tiến lớn cho sức khỏe!<br/><br/>
        Nếu bạn cảm thấy cần hỗ trợ thêm, đừng ngần ngại <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với chuyên gia</a> của chúng tôi.<br/><br/>
        <strong>🎯 Bạn đang làm rất tốt! Hãy tiếp tục kiên trì nhé! 💪</strong>
      </div>`;
    } else if (checkedSymptoms.length > 0) {
      checkedSymptoms.forEach((symptom) => {
        content += `<div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
          <strong>${symptom}</strong><br/>
          <small style="color: #666;">${SYMPTOM_MESSAGES[symptom]}</small>
        </div>`;
      });
    }

    return content;
  };

  const canEdit = (dayKey, actualDate) => {
    if (isTestMode) return true; // Bỏ giới hạn thời gian khi test
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const dayDate = format(actualDate, "yyyy-MM-dd");

    // Chỉ cho phép edit ngày hiện tại và trong giờ cho phép (trước 22h)
    return dayDate === today && now.getHours() < 22;
  };

  // Kiểm tra trạng thái của ngày để hiển thị thông báo phù hợp
  const getDayStatus = (dayKey, actualDate) => {
    if (isTestMode) return { canEdit: true, message: "" };

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const dayDate = format(actualDate, "yyyy-MM-dd");
    const isSubmitted = trackingData[dayKey]?.submitted;

    if (dayDate < today) {
      // Ngày đã qua
      if (isSubmitted) {
        return {
          canEdit: false,
          message: "",
          type: "past",
          showSubmitted: true,
        };
      } else {
        return {
          canEdit: false,
          message: "Đã qua",
          type: "past",
        };
      }
    } else if (dayDate > today) {
      // Ngày tương lai
      return {
        canEdit: false,
        message: "Sắp tới",
        type: "future",
      };
    } else {
      // Ngày hiện tại
      if (now.getHours() >= 22) {
        return {
          canEdit: false,
          message: "Quá 22h - không thể chỉnh sửa",
          type: "late",
        };
      } else {
        return {
          canEdit: true,
          message: "",
          type: "current",
        };
      }
    }
  };

  // Tính toán ngày bắt đầu cho từng tuần trong kế hoạch tự tạo
  const calculateCustomPlanDays = (
    stageIndex,
    periodIndex,
    weekInPeriod,
    dayIdx
  ) => {
    let totalDays = 0;

    // Đếm ngày từ các stage trước
    for (let s = 0; s < stageIndex; s++) {
      const prevStage = plan.stages[s];
      if (prevStage.periods) {
        prevStage.periods.forEach((period) => {
          const weeks = parseWeekRange(period.week_range);
          totalDays += weeks.length * 7;
        });
      }
    }

    // Đếm ngày từ các period trước trong stage hiện tại
    const currentStage = plan.stages[stageIndex];
    for (let p = 0; p < periodIndex; p++) {
      const prevPeriod = currentStage.periods[p];
      const weeks = parseWeekRange(prevPeriod.week_range);
      totalDays += weeks.length * 7;
    }

    // Thêm ngày từ tuần hiện tại
    totalDays += weekInPeriod * 7 + dayIdx;

    return totalDays;
  };

  if (loading)
    return (
      <div className="tracking-page-wrapper">
        <div className="tracking-content">
          <div className="tracking-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải kế hoạch...</p>
            </div>
          </div>
        </div>
      </div>
    );

  if (!plan)
    return (
      <div className="tracking-page-wrapper">
        <div className="tracking-content">
          <div className="tracking-container">
            <div className="error-container">
              <h3>Không tìm thấy kế hoạch</h3>
              <p>Vui lòng tạo kế hoạch cai thuốc trước khi theo dõi.</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="tracking-page-wrapper">
      <div className="tracking-content">
        <div className="tracking-container">
          <h1 className="tracking-heading">📅 Theo dõi tiến trình cai thuốc</h1>

          {/* Hiển thị thông tin loại kế hoạch */}
          <div className="plan-info">
            <div className="plan-type">
              {plan.isCustomPlan ? (
                <span className="custom-plan-badge">🎯 Kế hoạch tự tạo</span>
              ) : (
                <span className="system-plan-badge">
                  🏥 Kế hoạch đề xuất từ hệ thống
                </span>
              )}
            </div>
            {plan.createdDate && (
              <div className="plan-date">
                Ngày bắt đầu: {format(new Date(plan.createdDate), "dd/MM/yyyy")}
              </div>
            )}
          </div>

          {plan.stages.map((stage, stageIdx) => {
            const isCustomStage = stage.isCustomStage || plan.isCustomPlan;

            return (
              <div key={stageIdx} className="tracking-stage">
                <button
                  onClick={() =>
                    setSelected((prev) => ({
                      stage: prev.stage === stageIdx ? null : stageIdx,
                      week: null,
                    }))
                  }
                  className="tracking-stage-button"
                >
                  📋 Giai đoạn {stage.stageNumber || stageIdx + 1}
                  {isCustomStage && stage.periods
                    ? ` (${stage.periods.length} khoảng thời gian)`
                    : ` (${stage.targetCigarettes} điếu/ngày)`}
                </button>

                {selected.stage === stageIdx && (
                  <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                    {isCustomStage && stage.periods
                      ? // Hiển thị cho kế hoạch tự tạo - theo periods
                        stage.periods.map((period, periodIdx) => {
                          const weeks = parseWeekRange(period.week_range);

                          return (
                            <div
                              key={`period-${periodIdx}`}
                              className="tracking-period"
                            >
                              <div className="period-header">
                                <strong>
                                  📅 Mục tiêu của bạn là{" "}
                                  {period.targetCigarettes} điếu/ngày
                                </strong>
                              </div>

                              {weeks.map((weekNum, weekIdx) => (
                                <div
                                  key={`week-${weekNum}`}
                                  style={{
                                    marginLeft: "1rem",
                                    marginTop: "0.5rem",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      setSelected((prev) => ({
                                        ...prev,
                                        week:
                                          prev.week ===
                                          `${periodIdx}-${weekIdx}`
                                            ? null
                                            : `${periodIdx}-${weekIdx}`,
                                      }))
                                    }
                                    className="tracking-week-button"
                                  >
                                    📅 Tuần {weekNum}
                                  </button>

                                  {selected.week ===
                                    `${periodIdx}-${weekIdx}` && (
                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                          "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "1rem",
                                        marginTop: "0.5rem",
                                      }}
                                    >
                                      {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                                        const dayKey = `${stageIdx}-${periodIdx}-${weekIdx}-${dayIdx}`;

                                        const actualDate = new Date(
                                          plan.createdDate || new Date()
                                        );
                                        const totalDaysFromStart =
                                          calculateCustomPlanDays(
                                            stageIdx,
                                            periodIdx,
                                            weekIdx,
                                            dayIdx
                                          );
                                        actualDate.setDate(
                                          actualDate.getDate() +
                                            totalDaysFromStart
                                        );

                                        const currentTargetCigs =
                                          period.targetCigarettes;
                                        const dayStatus = getDayStatus(
                                          dayKey,
                                          actualDate
                                        );
                                        const isSubmitted =
                                          trackingData[dayKey]?.submitted;
                                        const isEditing =
                                          editingDays[dayKey] || false;

                                        return (
                                          <div
                                            key={dayIdx}
                                            className="tracking-day-card"
                                          >
                                            <div className="tracking-day-title">
                                              Ngày {dayIdx + 1}
                                            </div>
                                            <div className="tracking-day-date">
                                              {format(actualDate, "dd/MM/yyyy")}
                                            </div>
                                            <div className="tracking-target">
                                              Mục tiêu: {currentTargetCigs} điếu
                                            </div>

                                            <input
                                              type="number"
                                              className="tracking-input"
                                              placeholder="Số điếu thuốc"
                                              value={
                                                trackingData[dayKey]?.smoked ||
                                                ""
                                              }
                                              disabled={!isEditing}
                                              onChange={(e) =>
                                                handleInput(
                                                  dayKey,
                                                  "smoked",
                                                  e.target.value
                                                )
                                              }
                                            />

                                            <div className="tracking-symptoms">
                                              {SYMPTOMS.map((symp) => (
                                                <label
                                                  key={symp}
                                                  className="tracking-symptom-label"
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      trackingData[dayKey]
                                                        ?.symptoms?.[symp] ||
                                                      false
                                                    }
                                                    onChange={() =>
                                                      handleSymptomToggle(
                                                        dayKey,
                                                        symp
                                                      )
                                                    }
                                                    disabled={!isEditing}
                                                  />
                                                  {" " + symp}
                                                </label>
                                              ))}
                                            </div>

                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "0.5rem",
                                                marginTop: "0.5rem",
                                              }}
                                            >
                                              {dayStatus.canEdit &&
                                                !isEditing && (
                                                  <button
                                                    className="tracking-button-edit"
                                                    onClick={() =>
                                                      setEditingDays(
                                                        (prev) => ({
                                                          ...prev,
                                                          [dayKey]: true,
                                                        })
                                                      )
                                                    }
                                                  >
                                                    {isSubmitted
                                                      ? "Chỉnh sửa"
                                                      : "Edit"}
                                                  </button>
                                                )}
                                              {isEditing && (
                                                <button
                                                  className="tracking-button-submit"
                                                  onClick={() => {
                                                    handleInput(
                                                      dayKey,
                                                      "submitted",
                                                      true
                                                    );
                                                    saveData(
                                                      dayKey,
                                                      trackingData[dayKey]
                                                        ?.smoked || "0",
                                                      currentTargetCigs
                                                    );
                                                  }}
                                                >
                                                  Submit
                                                </button>
                                              )}
                                              {!dayStatus.canEdit &&
                                                dayStatus.message && (
                                                  <div
                                                    className={`tracking-warning tracking-warning-${dayStatus.type}`}
                                                  >
                                                    {dayStatus.message}
                                                  </div>
                                                )}
                                              {isSubmitted &&
                                                !dayStatus.canEdit && (
                                                  <div className="tracking-submitted">
                                                    ✅ Đã hoàn thành
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })
                      : // Hiển thị cho kế hoạch hệ thống - cấu trúc cũ
                        [0, 1, 2, 3].map((weekIdx) => (
                          <div
                            key={weekIdx}
                            style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
                          >
                            <button
                              onClick={() =>
                                setSelected((prev) => ({
                                  ...prev,
                                  week: prev.week === weekIdx ? null : weekIdx,
                                }))
                              }
                              className="tracking-week-button"
                            >
                              📅 Tuần {weekIdx + 1}
                            </button>

                            {selected.week === weekIdx && (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fill, minmax(280px, 1fr))",
                                  gap: "1rem",
                                  marginTop: "0.5rem",
                                }}
                              >
                                {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                                  const dayKey = `${stageIdx}-${weekIdx}-${dayIdx}`;
                                  const actualDate = new Date(
                                    plan.createdDate || new Date()
                                  );
                                  actualDate.setDate(
                                    actualDate.getDate() +
                                      stageIdx * 28 +
                                      weekIdx * 7 +
                                      dayIdx
                                  );

                                  const dayStatus = getDayStatus(
                                    dayKey,
                                    actualDate
                                  );
                                  const isSubmitted =
                                    trackingData[dayKey]?.submitted;
                                  const isEditing =
                                    editingDays[dayKey] || false;

                                  return (
                                    <div
                                      key={dayIdx}
                                      className="tracking-day-card"
                                    >
                                      <div className="tracking-day-title">
                                        Ngày {dayIdx + 1}
                                      </div>
                                      <div className="tracking-day-date">
                                        {format(actualDate, "dd/MM/yyyy")}
                                      </div>
                                      <div className="tracking-target">
                                        Mục tiêu: {stage.targetCigarettes} điếu
                                      </div>

                                      <input
                                        type="number"
                                        className="tracking-input"
                                        placeholder="Số điếu thuốc"
                                        value={
                                          trackingData[dayKey]?.smoked || ""
                                        }
                                        disabled={!isEditing}
                                        onChange={(e) =>
                                          handleInput(
                                            dayKey,
                                            "smoked",
                                            e.target.value
                                          )
                                        }
                                      />

                                      <div className="tracking-symptoms">
                                        {SYMPTOMS.map((symp) => (
                                          <label
                                            key={symp}
                                            className="tracking-symptom-label"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                trackingData[dayKey]
                                                  ?.symptoms?.[symp] || false
                                              }
                                              onChange={() =>
                                                handleSymptomToggle(
                                                  dayKey,
                                                  symp
                                                )
                                              }
                                              disabled={!isEditing}
                                            />
                                            {" " + symp}
                                          </label>
                                        ))}
                                      </div>

                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          gap: "0.5rem",
                                          marginTop: "0.5rem",
                                        }}
                                      >
                                        {dayStatus.canEdit && !isEditing && (
                                          <button
                                            className="tracking-button-edit"
                                            onClick={() =>
                                              setEditingDays((prev) => ({
                                                ...prev,
                                                [dayKey]: true,
                                              }))
                                            }
                                          >
                                            {isSubmitted ? "Chỉnh sửa" : "Edit"}
                                          </button>
                                        )}
                                        {isEditing && (
                                          <button
                                            className="tracking-button-submit"
                                            onClick={() => {
                                              handleInput(
                                                dayKey,
                                                "submitted",
                                                true
                                              );
                                              saveData(
                                                dayKey,
                                                trackingData[dayKey]?.smoked ||
                                                  "0",
                                                stage.targetCigarettes
                                              );
                                            }}
                                          >
                                            Submit
                                          </button>
                                        )}
                                        {!dayStatus.canEdit &&
                                          dayStatus.message && (
                                            <div
                                              className={`tracking-warning tracking-warning-${dayStatus.type}`}
                                            >
                                              {dayStatus.message}
                                            </div>
                                          )}
                                        {isSubmitted && !dayStatus.canEdit && (
                                          <div className="tracking-submitted">
                                            ✅ Đã hoàn thành
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                )}
              </div>
            );
          })}

          <Modal
            title="📣 Thông báo hôm nay"
            open={isModalVisible}
            footer={null}
            closable={false}
            width={500}
            centered
            className="tracking-modal"
          >
            <div
              className="popup-content"
              dangerouslySetInnerHTML={{ __html: popupContent }}
              style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}
            ></div>

            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setIsModalVisible(false)}
                className="custom-popup-button"
              >
                Đóng
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
