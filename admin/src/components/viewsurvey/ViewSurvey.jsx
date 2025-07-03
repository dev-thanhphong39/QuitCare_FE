import React, { useState, useEffect } from "react";
import api from "../../configs/axios";
import "./ViewSurvey.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function ViewSurvey() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  // Hàm format dữ liệu cho dễ đọc
  const formatDisplayValue = (value, type = "text") => {
    if (!value) return "Chưa có thông tin";

    switch (type) {
      case "timeToFirst":
        switch (value) {
          case "BETWEEN_31_AND_60_MIN":
            return "31-60 phút";
          case "BETWEEN_1_AND_3_DAYS":
            return "1-3 ngày";
          case "WITHIN_5_MIN":
            return "Trong vòng 5 phút";
          case "BETWEEN_6_AND_30_MIN":
            return "6-30 phút";
          case "AFTER_60_MIN":
            return "Sau 60 phút";
          default:
            return value;
        }

      case "quitAttempts":
        switch (value) {
          case "ONE_TO_TWO":
            return "1-2 lần";
          case "THREE_TO_FIVE":
            return "3-5 lần";
          case "MORE_THAN_FIVE":
            return "Hơn 5 lần";
          case "NEVER":
            return "Chưa từng";
          default:
            return value;
        }

      case "readinessLevel":
        switch (value) {
          case "UNDERCONSIDERATION":
            return "Đang cân nhắc";
          case "READY":
            return "Sẵn sàng";
          case "NOT_READY":
            return "Chưa sẵn sàng";
          case "VERY_READY":
            return "Rất sẵn sàng";
          default:
            return value;
        }

      case "quitReasons":
        switch (value) {
          case "Family_loved_ones":
            return "Vì gia đình và người thân";
          case "Health_concerns":
            return "Vì sức khỏe";
          case "Financial_reasons":
            return "Vì lý do tài chính";
          case "Social_pressure":
            return "Vì áp lực xã hội";
          default:
            return value;
        }

      case "triggerSituation":
        switch (value) {
          case "Áp lực":
            return "Áp lực";
          case "Stress":
            return "Khi căng thẳng";
          case "Social_drinking":
            return "Khi uống rượu/bia";
          case "After_meals":
            return "Sau bữa ăn";
          case "Break_time":
            return "Giờ nghỉ";
          default:
            return value;
        }

      default:
        return value;
    }
  };

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const accountId = localStorage.getItem("accountId");

      if (!accountId) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      try {
        const response = await api.get(`/smoking-status`);
        const userSurvey = response.data.find(
          (item) => item.accountId === accountId
        );
        setSurveyData(userSurvey || {});
      } catch (apiError) {
        console.log("API không có dữ liệu, chỉ lấy từ localStorage");
        setSurveyData({});
      }

      const planSurvey = localStorage.getItem("planSurvey");
      if (planSurvey) {
        const surveyFromStorage = JSON.parse(planSurvey);
        setSurveyData((prev) => ({ ...prev, surveyFromStorage }));
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu khảo sát:", err);
      setError("Không thể tải dữ liệu khảo sát");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    <Navbar />
      <div className="view-survey-container">
        <h2>Thông tin khảo sát của bạn</h2>

        {surveyData && (
          <div className="survey-details">
            <div className="section">
              <h3>Thông tin cơ bản</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Tuổi bắt đầu hút thuốc:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.started_smoking_age ||
                        surveyData.surveyFromStorage?.started_smoking_age
                    )}{" "}
                    tuổi
                  </span>
                </div>
                <div className="info-item">
                  <label>Số điếu thuốc/ngày:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.cigarettes_per_day ||
                        surveyData.surveyFromStorage?.cigarettes_per_day
                    )}{" "}
                    điếu
                  </span>
                </div>
                <div className="info-item">
                  <label>Số điếu thuốc/bao:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.cigarettes_per_pack ||
                        surveyData.surveyFromStorage?.cigarettes_per_pack
                    )}{" "}
                    điếu
                  </span>
                </div>
                <div className="info-item">
                  <label>Thời gian đến điếu thuốc đầu tiên:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.timeToFirstCigarette ||
                        surveyData.surveyFromStorage?.timeToFirstCigarette,
                      "timeToFirst"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="section">
              <h3>Lịch sử cai thuốc</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Số lần cai thuốc:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.quitAttempts ||
                        surveyData.surveyFromStorage?.quitAttempts,
                      "quitAttempts"
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <label>Thời gian cai lâu nhất:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.longestQuitDuration ||
                        surveyData.surveyFromStorage?.longestQuitDuration,
                      "timeToFirst"
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <label>Mức độ sẵn sàng:</label>
                  <span>
                    {formatDisplayValue(
                      surveyData.readinessLevel ||
                        surveyData.surveyFromStorage?.readinessLevel,
                      "readinessLevel"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="section">
              <h3>Động lực và mục tiêu</h3>
              <div className="info-item">
                <label>Lý do cai thuốc:</label>
                <span>
                  {formatDisplayValue(
                    surveyData.quitReasons ||
                      surveyData.surveyFromStorage?.quitReasons,
                    "quitReasons"
                  )}
                </span>
              </div>
              <div className="info-item">
                <label>Giai đoạn hút thuốc nhiều:</label>
                <span>
                  {formatDisplayValue(
                    surveyData.triggerSituation ||
                      surveyData.surveyFromStorage?.triggerSituation,
                    "triggerSituation"
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    <Footer />
    </>
  );
}

export default ViewSurvey;
