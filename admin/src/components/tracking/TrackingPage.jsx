import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { format } from "date-fns";
import "./TrackingPage.css";

const SYMPTOMS = [
  "Thèm thuốc lá",
  "Thèm ăn",
  "Ho dai dẳng",
  "Triệu chứng cảm cúm",
  "Thay đổi tâm trạng",
  "Táo bón",
];

const TrackingPage = () => {
  const accountId = localStorage.getItem("accountId");
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState({ stage: null, week: null });
  const [trackingData, setTrackingData] = useState({});
  const [currentDate] = useState(new Date());
  const [editingDays, setEditingDays] = useState({});

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
        saved[key.replace(`track-${accountId}-`, "")] = JSON.parse(localStorage.getItem(key));
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

  const saveData = (dayKey, smoked, targetCigs) => {
    const data = trackingData[dayKey];
    localStorage.setItem(`track-${accountId}-${dayKey}`, JSON.stringify(data));

    const noteList = JSON.parse(localStorage.getItem(`notifications-${accountId}`) || "[]");
    noteList.push({
      date: new Date().toISOString(),
      dayKey,
      message:
        parseInt(smoked) <= targetCigs
          ? "🎉 Bạn đã hoàn thành mục tiêu cai thuốc hôm nay!"
          : "⚠️ Bạn hút nhiều hơn kế hoạch hôm nay!",
    });
    localStorage.setItem(`notifications-${accountId}`, JSON.stringify(noteList));

    setEditingDays((prev) => ({ ...prev, [dayKey]: false }));
  };

  const canEdit = (dayKey, actualDate) => {
    const now = new Date();
    return (
      format(now, "yyyy-MM-dd") === format(actualDate, "yyyy-MM-dd") &&
      now.getHours() < 22
    );
  };

  if (!plan) return <div className="tracking-container">Đang tải kế hoạch...</div>;

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
              <div key={weekIdx} style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginTop: "0.5rem" }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const dayKey = `${stageIdx}-${weekIdx}-${dayIdx}`;
                      const actualDate = new Date(plan.createdDate || new Date());
                      actualDate.setDate(actualDate.getDate() + stageIdx * 28 + weekIdx * 7 + dayIdx);

                      const isTodayEditable = canEdit(dayKey, actualDate);
                      const isSubmitted = trackingData[dayKey]?.submitted;
                      const isEditing = editingDays[dayKey] || false;

                      return (
                        <div key={dayIdx} className="tracking-day-card">
                          <div className="tracking-day-title">Ngày {dayIdx + 1}</div>
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
                              <label key={symp} className="tracking-symptom-label">
                                <input
                                  type="checkbox"
                                  checked={trackingData[dayKey]?.symptoms?.[symp] || false}
                                  onChange={() => handleSymptomToggle(dayKey, symp)}
                                  disabled={!isEditing}
                                />
                                {" " + symp}
                              </label>
                            ))}
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
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
    </div>
  );
};

export default TrackingPage;
