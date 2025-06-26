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
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        const result = Array.isArray(res.data)
          ? res.data[res.data.length - 1]
          : res.data;
        setPlan(result);
      } catch {
        alert("Không lấy được kế hoạch.");
      }
    }

    fetchPlan();
    loadSavedData();
  }, []);

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
    content +=
      smoked <= targetCigs
        ? `🎉 Bạn đã hoàn thành mục tiêu hôm nay!\nBạn đã tiết kiệm được ${moneySaved.toLocaleString()} VND.\n\n`
        : `⚠️ Hôm nay bạn hút nhiều hơn kế hoạch!\n\n`;

    const symptomsToday = trackingData[dayKey]?.symptoms || {};
    const checkedSymptoms = Object.entries(symptomsToday)
      .filter(([_, checked]) => checked)
      .map(([symptom]) => symptom);

    if (checkedSymptoms.length >= 3) {
      content += `😥 Hôm nay bạn đang gặp nhiều triệu chứng liên quan đến việc cai thuốc. Đây là điều hoàn toàn bình thường trong quá trình điều chỉnh của cơ thể.\n\n`;
      content += `Hãy cố gắng nghỉ ngơi, giữ tinh thần thoải mái và đừng ngần ngại tìm đến sự hỗ trợ nếu cần.\n👉 <a href="${BOOKING_LINK}" target="_blank" rel="noopener noreferrer">Đặt lịch tư vấn với chuyên gia</a>\n\n`;
      content += `🌱 Bạn đang làm rất tốt rồi – tiếp tục kiên trì nhé! 💪`;
    } else if (checkedSymptoms.length > 0) {
      checkedSymptoms.forEach((symptom) => {
        content += `🩺 ${symptom}\n${SYMPTOM_MESSAGES[symptom]}\n\n`;
      });
    }

    // Đếm liên tiếp và hiện link nếu triệu chứng lặp lại ≥ 3 ngày
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
        content += `\n📌 <b>Triệu chứng "${symptom}" đã xuất hiện liên tiếp ${consecutive} ngày.</b> Bạn nên cân nhắc <a href="${BOOKING_LINK}" target="_blank" rel="noopener noreferrer">đặt lịch tư vấn</a> để được hỗ trợ thêm.`;
      }
    });

    return content;
  };

  const saveData = (dayKey, smoked, targetCigs) => {
    const data = trackingData[dayKey];
    const updatedData = {
      ...data,
      target: targetCigs, // Lưu lại số điếu theo kế hoạch hôm đó
    };
    localStorage.setItem(
      `track-${accountId}-${dayKey}`,
      JSON.stringify(updatedData)
    );

    const noteList = JSON.parse(
      localStorage.getItem(`notifications-${accountId}`) || "[]"
    );
    noteList.push({
      date: new Date().toISOString(),
      dayKey,
      message:
        parseInt(smoked) <= targetCigs
          ? "🎉 Bạn đã hoàn thành mục tiêu cai thuốc hôm nay!"
          : "⚠️ Bạn hút nhiều hơn kế hoạch hôm nay!",
    });
    localStorage.setItem(
      `notifications-${accountId}`,
      JSON.stringify(noteList)
    );

    const popupText = generatePopupContent(dayKey, smoked, targetCigs);
    setPopupContent(popupText);
    setIsModalVisible(true);

    setEditingDays((prev) => ({ ...prev, [dayKey]: false }));
  };

  const canEdit = (dayKey, actualDate) => {
    if (isTestMode) return true; // Bỏ giới hạn thời gian khi test
    const now = new Date();
    return (
      format(now, "yyyy-MM-dd") === format(actualDate, "yyyy-MM-dd") &&
      now.getHours() < 22
    );
  };

  if (!plan)
    return <div className="tracking-container">Đang tải kế hoạch...</div>;

  return (
    <div className="tracking-container">
      <h1 className="tracking-heading">📅 Theo dõi tiến trình cai thuốc</h1>

      {plan.stages.map((stage, stageIdx) => (
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
            📋 Giai đoạn {stageIdx + 1} ({stage.targetCigarettes} điếu/ngày)
          </button>

          {selected.stage === stageIdx &&
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

                      const isTodayEditable = canEdit(dayKey, actualDate);
                      const isSubmitted = trackingData[dayKey]?.submitted;
                      const isEditing = editingDays[dayKey] || false;

                      return (
                        <div key={dayIdx} className="tracking-day-card">
                          <div className="tracking-day-title">
                            Ngày {dayIdx + 1}
                          </div>
                          <div className="tracking-day-date">
                            {format(actualDate, "dd/MM/yyyy")}
                          </div>

                          <input
                            type="number"
                            className="tracking-input"
                            placeholder="Số điếu thuốc"
                            value={trackingData[dayKey]?.smoked || ""}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleInput(dayKey, "smoked", e.target.value)
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
                                    trackingData[dayKey]?.symptoms?.[symp] ||
                                    false
                                  }
                                  onChange={() =>
                                    handleSymptomToggle(dayKey, symp)
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
                            {isTodayEditable && !isSubmitted && !isEditing && (
                              <button
                                className="tracking-button-edit"
                                onClick={() =>
                                  setEditingDays((prev) => ({
                                    ...prev,
                                    [dayKey]: true,
                                  }))
                                }
                              >
                                Edit
                              </button>
                            )}
                            {isEditing && (
                              <button
                                className="tracking-button-submit"
                                onClick={() => {
                                  handleInput(dayKey, "submitted", true);
                                  saveData(
                                    dayKey,
                                    trackingData[dayKey]?.smoked || "0",
                                    stage.targetCigarettes
                                  );
                                }}
                              >
                                Submit
                              </button>
                            )}
                            {!isTodayEditable && (
                              <div className="tracking-warning">
                                Quá 22h - không chỉnh sửa
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
      ))}

      <Modal
        title="📣 Thông báo hôm nay"
        open={isModalVisible}
        footer={null} // Ẩn hết nút mặc định
        closable={false} // Ẩn nút [X] ở góc phải (tuỳ chọn)
      >
        <div
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
  );
};

export default TrackingPage;
