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
          // ✅ Xử lý enum từ API (tiếng Anh)
          case "LESS_THAN_5_MIN":
          case "WITHIN_5_MIN":
            return "Trong vòng 5 phút";
          case "BETWEEN_6_AND_30_MIN":
            return "6-30 phút";
          case "BETWEEN_31_AND_60_MIN": // ✅ Chỉ giữ lại 1 lần
            return "31-60 phút";
          case "MORE_THAN_60_MIN":
          case "AFTER_60_MIN":
            return "Sau 60 phút";

          // ✅ Xử lý dữ liệu từ form (tiếng Việt)
          case "≤5 phút":
            return "Trong vòng 5 phút";
          case "6–30 phút":
            return "6-30 phút";
          case "31–60 phút":
            return "31-60 phút";
          case ">60 phút":
            return "Sau 60 phút";

          default:
            return value;
        }

      case "quitAttempts":
        switch (value) {
          // ✅ Enum từ API
          case "ONE_TO_TWO":
            return "1-2 lần";
          case "THREE_TO_FIVE":
            return "3-5 lần";
          case "MORE_THAN_FIVE":
          case "MORE_THAN_THREE":
            return "Hơn 3 lần";
          case "NEVER":
          case "NONE":
            return "Chưa từng";

          // ✅ Dữ liệu số từ form
          case "0":
            return "Chưa từng";
          case "1":
            return "1 lần";
          case "2":
            return "2 lần";
          default:
            // Nếu là số, hiển thị "{số} lần"
            if (!isNaN(value) && parseInt(value) >= 0) {
              const num = parseInt(value);
              if (num === 0) return "Chưa từng";
              if (num === 1) return "1 lần";
              return `${num} lần`;
            }
            return value;
        }

      case "longestQuitDuration":
        switch (value) {
          // ✅ Enum từ API và form đều giống nhau
          case "LESS_THAN_1_DAY":
            return "Ít hơn 1 ngày";
          case "BETWEEN_1_AND_3_DAYS":
            return "Từ 1-3 ngày";
          case "ONE_WEEK":
            return "1 tuần";
          case "MORE_THAN_ONE_WEEK":
            return "Hơn 1 tuần";
          default:
            return value;
        }

      case "readinessLevel":
        switch (value) {
          // ✅ Enum từ API
          case "UNDERCONSIDERATION":
            return "Đang cân nhắc";
          case "READY":
          case "ALREADY":
            return "Rất sẵn sàng";
          case "NOTREADY":
          case "NOT_READY":
            return "Chưa sẵn sàng";
          case "VERY_READY":
            return "Rất sẵn sàng";

          // ✅ Dữ liệu từ form (đã là tiếng Việt)
          case "Chưa sẵn sàng":
            return "Chưa sẵn sàng";
          case "Đang cân nhắc":
            return "Đang cân nhắc";
          case "Rất sẵn sàng":
            return "Rất sẵn sàng";

          default:
            return value;
        }

      case "quitReasons":
        switch (value) {
          // ✅ Enum từ form
          case "Improving_health":
            return "Cải thiện sức khỏe";
          case "Family_loved_ones":
            return "Vì gia đình và người thân";
          case "Financial_pressure":
            return "Áp lực tài chính";
          case "Feeling_tired_of_addiction":
            return "Cảm thấy mệt mỏi với việc nghiện thuốc";
          case "Wanting_to_set_an_example_for_children":
            return "Muốn làm gương cho con cái";
          case "Being_banned_from_smoking_at_work_home":
            return "Bị cấm hút thuốc ở nơi làm việc/nhà";

          // ✅ Các enum khác có thể có
          case "Health_concerns":
            return "Cải thiện sức khỏe";
          case "Financial_reasons":
            return "Áp lực tài chính";
          case "Social_pressure":
            return "Áp lực xã hội";

          default:
            return value;
        }

      case "triggerSituation":
        // ✅ Dữ liệu này thường là text tự do, chỉ format một số case phổ biến
        switch (value.toLowerCase()) {
          case "stress":
          case "căng thẳng":
          case "áp lực":
            return "Khi căng thẳng/áp lực";
          case "social_drinking":
          case "uống rượu":
          case "uống bia":
            return "Khi uống rượu/bia";
          case "after_meals":
          case "sau bữa ăn":
            return "Sau bữa ăn";
          case "break_time":
          case "giờ nghỉ":
            return "Giờ nghỉ";
          case "work_pressure":
          case "công việc":
            return "Áp lực công việc";
          default:
            return value; // Giữ nguyên text tự do
        }

      case "quitIntentionTimeline":
        switch (value) {
          // ✅ Enum từ API
          case "ONEWEEK":
            return "Trong 7 ngày";
          case "ONEMONTH":
            return "Trong 1 tháng";
          case "THREEMONTH":
            return "Trong 3 tháng";
          case "FIVEMONTH":
            return "Trong 5 tháng";
          case "UNKNOWN":
            return "Chưa chắc chắn";

          // ✅ Dữ liệu từ form (đã là tiếng Việt)
          case "7 ngày":
            return "Trong 7 ngày";
          case "1 tháng":
            return "Trong 1 tháng";
          case "3 tháng":
            return "Trong 3 tháng";
          case "5 tháng":
            return "Trong 5 tháng";
          case "Chưa chắc":
            return "Chưa chắc chắn";

          default:
            return value;
        }

      case "cravingWithoutSmoking":
        if (value === true || value === "true") {
          return "Có cảm thấy khó chịu";
        } else if (value === false || value === "false") {
          return "Không cảm thấy khó chịu";
        }
        return value;

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
        const response = await api.get(`/smoking-status/account/${accountId}`);
        setSurveyData(response.data || {});
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
        <h2>📋 Thông tin khảo sát của bạn</h2>

        {surveyData &&
          (Object.keys(surveyData).length > 0 ||
            surveyData.surveyFromStorage) && (
            <div className="survey-details">
              {/* ✅ Thông tin cơ bản */}
              <div className="section">
                <h3>📊 Thông tin cơ bản</h3>
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
                    <label>Số điếu thuốc mỗi ngày:</label>
                    <span>
                      {formatDisplayValue(
                        surveyData.cigarettes_per_day ||
                          surveyData.surveyFromStorage?.cigarettes_per_day
                      )}{" "}
                      điếu
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Số điếu thuốc mỗi bao:</label>
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

              {/* ✅ Lịch sử cai thuốc */}
              <div className="section">
                <h3>📈 Lịch sử cai thuốc</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Số lần đã cố gắng cai thuốc:</label>
                    <span>
                      {formatDisplayValue(
                        surveyData.quitAttempts ||
                          surveyData.surveyFromStorage?.quitAttempts,
                        "quitAttempts"
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Thời gian cai thuốc lâu nhất:</label>
                    <span>
                      {formatDisplayValue(
                        surveyData.longestQuitDuration ||
                          surveyData.surveyFromStorage?.longestQuitDuration,
                        "longestQuitDuration"
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Cảm thấy khó chịu khi không hút:</label>
                    <span>
                      {formatDisplayValue(
                        surveyData.cravingWithoutSmoking ||
                          surveyData.surveyFromStorage?.cravingWithoutSmoking,
                        "cravingWithoutSmoking"
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Mức độ sẵn sàng cai thuốc:</label>
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

              {/* ✅ Động lực và mục tiêu */}
              <div className="section">
                <h3>🎯 Động lực và mục tiêu</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Lý do muốn cai thuốc:</label>
                    <span>
                      {formatDisplayValue(
                        surveyData.quitReasons ||
                          surveyData.surveyFromStorage?.quitReasons,
                        "quitReasons"
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Tình huống thường hút thuốc nhiều:</label>
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
            </div>
          )}

        {/* ✅ Hiển thị khi không có dữ liệu */}
        {(!surveyData ||
          (Object.keys(surveyData).length === 0 &&
            !surveyData.surveyFromStorage)) && (
          <div className="no-data">
            <p>📝 Chưa có thông tin khảo sát nào được lưu.</p>
            <p>Vui lòng hoàn thành khảo sát để xem thông tin chi tiết.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewSurvey;
