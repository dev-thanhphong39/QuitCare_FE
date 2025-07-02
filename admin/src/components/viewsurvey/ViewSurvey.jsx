import React, { useState, useEffect } from "react";
import api from "../../configs/axios";
import "./ViewSurvey.css";

function ViewSurvey() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const accountId = localStorage.getItem("accountId");

      if (!accountId) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      try {
        const response = await api.get(`/smoking-status`);
        // Lọc dữ liệu theo accountId nếu có
        const userSurvey = response.data.find(
          (item) => item.accountId === accountId
        );
        setSurveyData(userSurvey || {});
      } catch (apiError) {
        console.log("API không có dữ liệu, chỉ lấy từ localStorage");
        setSurveyData({});
      }

      // Luôn luôn lấy thêm thông tin từ localStorage
      const planSurvey = localStorage.getItem("planSurvey");
      if (planSurvey) {
        const surveyFromStorage = JSON.parse(planSurvey);
        setSurveyData((prev) => ({ ...prev, surveyFromStorage }));
      }


      setSurveyData((prev) => ({ ...prev, ...additionalData }));
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
    <div className="view-survey-container">
      <h2>Thông tin khảo sát của bạn</h2>

      {/* Hiển thị thông tin chi tiết */}
      {surveyData && (
        <div className="survey-details">
          <div className="section">
            <h3>Thông tin cơ bản</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Tuổi bắt đầu hút thuốc:</label>
                <span>
                  {surveyData.started_smoking_age ||
                    surveyData.surveyFromStorage?.started_smoking_age}
                </span>
              </div>
              <div className="info-item">
                <label>Số điếu thuốc/ngày:</label>
                <span>
                  {surveyData.cigarettes_per_day ||
                    surveyData.surveyFromStorage?.cigarettes_per_day}
                </span>
              </div>
              <div className="info-item">
                <label>Số điếu thuốc/bao:</label>
                <span>
                  {surveyData.cigarettes_per_pack ||
                    surveyData.surveyFromStorage?.cigarettes_per_pack}
                </span>
              </div>
              <div className="info-item">
                <label>Thời gian đến điếu thuốc đầu tiên:</label>
                <span>
                  {surveyData.timeToFirstCigarette ||
                    surveyData.surveyFromStorage?.timeToFirstCigarette}
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
                  {surveyData.quitAttempts ||
                    surveyData.surveyFromStorage?.quitAttempts}
                </span>
              </div>
              <div className="info-item">
                <label>Thời gian cai lâu nhất:</label>
                <span>
                  {surveyData.longestQuitDuration ||
                    surveyData.surveyFromStorage?.longestQuitDuration}
                </span>
              </div>
              <div className="info-item">
                <label>Mức độ sẵn sàng:</label>
                <span>
                  {surveyData.readinessLevel ||
                    surveyData.surveyFromStorage?.readinessLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Động lực và mục tiêu</h3>
            <div className="info-item">
              <label>Lý do cai thuốc:</label>
              <span>
                {surveyData.quitReasons ||
                  surveyData.surveyFromStorage?.quitReasons}
              </span>
            </div>
            <div className="info-item">
              <label>Tình huống kích hoạt:</label>
              <span>
                {surveyData.triggerSituation ||
                  surveyData.surveyFromStorage?.triggerSituation}
              </span>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default ViewSurvey;
