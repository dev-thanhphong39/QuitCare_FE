import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./SuggestPlaning.css";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "antd"; // Thêm import Modal và Button

function SuggestPlaning() {
  // Đọc trạng thái xác nhận từ localStorage khi khởi tạo
  const accountId = localStorage.getItem("accountId");
  const [isConfirmed, setIsConfirmed] = useState(
    () => localStorage.getItem(`plan_confirmed_${accountId}`) === "true"
  );
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    // Hàm lấy kế hoạch đề xuất
    async function fetchPlan() {
      setLoading(true);
      setError("");

      try {
        // Kiểm tra xem có kế hoạch đã được lưu trong backend không
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        if (res.data && !Array.isArray(res.data)) {
          setPlan(res.data);
          // Kiểm tra xem đã xác nhận chưa
          if (res.data.isAgreedPlan) {
            setIsConfirmed(true);
          }
          setLoading(false); // THÊM DÒNG NÀY
          return;
        }
      } catch (err) {
        // Nếu chưa có kế hoạch trong backend, đọc từ localStorage
        console.log("Chưa có kế hoạch trong backend, đọc từ localStorage");
      }

      // Đọc kế hoạch đề xuất từ localStorage
      const suggestedPlan = localStorage.getItem("suggestedPlan");
      if (suggestedPlan) {
        const planData = JSON.parse(suggestedPlan);
        setPlan(planData);
      } else {
        setError("Không tìm thấy kế hoạch đề xuất.");
      }

      setLoading(false);
    }

    fetchPlan();
  }, [accountId, navigate]);

  // Hàm xử lý xác nhận kế hoạch - GỌI API LÚC NÀY
  const handleConfirmPlan = async () => {
    setConfirmLoading(true);
    try {
      // Lấy thông tin khảo sát từ localStorage
      const surveyData = localStorage.getItem("planSurvey");
      if (!surveyData) {
        throw new Error("Không tìm thấy thông tin khảo sát");
      }

      const survey = JSON.parse(surveyData);

      // Bước 1: Gửi thông tin khảo sát
      const payload = {
        started_smoking_age: parseInt(survey.started_smoking_age),
        cigarettes_per_day: parseInt(survey.cigarettes_per_day),
        cigarettes_per_pack: parseInt(survey.cigarettes_per_pack),
        timeToFirstCigarette: mapTime(survey.timeToFirstCigarette),
        status: "ACTIVE",
        quitAttempts: mapQuitAttempts(survey.quitAttempts),
        longestQuitDuration: mapDuration(survey.longestQuitDuration),
        cravingWithoutSmoking: survey.cravingWithoutSmoking === "true",
        triggerSituation: survey.triggerSituation.trim(),
        quitIntentionTimeline: mapTimeline(survey.quitIntentionTimeline),
        readinessLevel: mapReadiness(survey.readinessLevel),
        quitReasons: survey.quitReasons,
      };

      await api.post(`/smoking-status/account/${accountId}`, payload);

      // Bước 2: Tạo kế hoạch với systemPlan = true
      const planResponse = await api.post(
        `/v1/customers/${accountId}/quit-plans`,
        {
          systemPlan: true,
        }
      );

      // Bước 3: Xác nhận kế hoạch
      await api.put(
        `/v1/customers/${accountId}/quit-plans/${planResponse.data.id}`,
        {
          isAgreedPlan: true,
          quitPlanStatus: "DRAFT",
        }
      );

      // Bước 4: Lấy lại dữ liệu kế hoạch từ backend và cập nhật state
      const updatedPlanResponse = await api.get(
        `/v1/customers/${accountId}/quit-plans`
      );
      if (updatedPlanResponse.data) {
        setPlan(updatedPlanResponse.data); // Cập nhật state với dữ liệu từ backend
      }

      // Đánh dấu đã xác nhận
      setIsConfirmed(true);
      localStorage.setItem(`plan_confirmed_${accountId}`, "true");

      // Xóa dữ liệu tạm thời NHƯNG GIỮ LẠI state plan
      localStorage.removeItem("suggestedPlan");
      localStorage.removeItem("planSurvey");

      Modal.success({
        title: "Xác nhận thành công!",
        content: "Kế hoạch cai thuốc đã được xác nhận. Chúc bạn thành công!",
        okText: "Đóng",
      });
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      Modal.error({
        title: "Lỗi xác nhận",
        content: "Không thể xác nhận kế hoạch. Vui lòng thử lại!",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // Thêm các hàm mapping từ Planning.jsx
  const mapTime = (value) => {
    switch (value) {
      case "≤5 phút":
        return "LESS_THAN_5_MIN";
      case "6–30 phút":
        return "BETWEEN_6_AND_30_MIN";
      case "31–60 phút":
        return "BETWEEN_31_AND_60_MIN";
      case ">60 phút":
        return "MORE_THAN_60_MIN";
      default:
        return "";
    }
  };

  const mapQuitAttempts = (value) => {
    const num = parseInt(value);
    if (num === 0) return "NONE";
    if (num <= 2) return "ONE_TO_TWO";
    return "MORE_THAN_THREE";
  };

  const mapDuration = (value) => {
    switch (value) {
      case "LESS_THAN_1_DAY":
        return "LESS_THAN_1_DAY";
      case "BETWEEN_1_AND_3_DAYS":
        return "BETWEEN_1_AND_3_DAYS";
      case "ONE_WEEK":
        return "ONE_WEEK";
      case "MORE_THAN_ONE_WEEK":
        return "MORE_THAN_ONE_WEEK";
      default:
        return "";
    }
  };

  const mapTimeline = (value) => {
    switch (value) {
      case "7 ngày":
        return "ONEWEEK";
      case "1 tháng":
        return "ONEMONTH";
      case "3 tháng":
        return "THREEMONTH";
      case "5 tháng":
        return "FIVEMONTH";
      case "Chưa chắc":
        return "UNKNOWN";
      default:
        return "";
    }
  };

  const mapReadiness = (value) => {
    switch (value) {
      case "Chưa sẵn sàng":
        return "NOTREADY";
      case "Đang cân nhắc":
        return "UNDERCONSIDERATION";
      case "Rất sẵn sàng":
        return "ALREADY";
      default:
        return "";
    }
  };

  return (
    <>
      <Navbar />
      <div className="suggest-container">
        {loading ? (
          // Hiển thị loading khi đang tải dữ liệu
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        ) : error ? (
          // Hiển thị lỗi nếu có lỗi
          <div style={{ color: "red", textAlign: "center", padding: 40 }}>
            {error}
          </div>
        ) : (
          // Nếu có dữ liệu kế hoạch thì hiển thị thông tin kế hoạch
          <>
            <div className="suggest-header">
              <div>
                <span role="img" aria-label="plan">
                  📋
                </span>
                <b> Kế hoạch cai thuốc được đề xuất</b>
              </div>
              <div>
                <span role="img" aria-label="brain">
                  🧠
                </span>
                {/* Hiển thị mức độ nghiện */}
                Mức độ nghiện hệ thống đánh giá:{" "}
                <b>
                  {plan.addictionLevel === "LOW"
                    ? "Thấp"
                    : plan.addictionLevel === "MEDIUM"
                    ? "Trung bình"
                    : "Cao"}
                </b>
              </div>
              <div>
                <span role="img" aria-label="cigarette">
                  🚬
                </span>
                {/* Hiển thị số điếu hút mỗi ngày ở giai đoạn đầu */}
                Trung bình số điếu hút mỗi ngày:{" "}
                <b>
                  {plan.stages && plan.stages.length > 0
                    ? plan.stages[0].targetCigarettes
                    : "-"}
                </b>
              </div>
            </div>

            <div className="suggest-table-wrapper">
              <table className="suggest-table">
                <thead>
                  <tr>
                    <th>Giai đoạn (khoảng 4 tuần)</th>
                    <th>Thời gian</th>
                    <th>Số điếu mỗi ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Nếu có dữ liệu các giai đoạn thì hiển thị từng dòng */}
                  {plan.stages && plan.stages.length > 0 ? (
                    plan.stages.map((stage, idx) => (
                      <tr key={stage.id || idx}>
                        <td>Giai đoạn {stage.stageNumber || idx + 1}</td>
                        <td>
                          {stage.week_range ||
                            `Tuần ${1 + idx * 4}-${4 + idx * 4}`}
                        </td>
                        <td>{stage.targetCigarettes} điếu</td>
                      </tr>
                    ))
                  ) : (
                    // Nếu không có dữ liệu giai đoạn thì báo không có
                    <tr>
                      <td colSpan={3}>Không có dữ liệu giai đoạn</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Chỉ hiển thị phần xác nhận nếu chưa được xác nhận */}
            {!isConfirmed && (
              <div className="suggest-actions">
                <div className="suggest-question">
                  <h3>🤔 Bạn có muốn xác nhận kế hoạch này không?</h3>
                  <p>
                    Nếu đồng ý, kế hoạch sẽ được lưu và bạn có thể bắt đầu theo
                    dõi tiến trình cai thuốc. Nếu không, bạn có thể tự lập kế
                    hoạch khác.
                  </p>
                </div>

                <div className="suggest-buttons">
                  <Button
                    type="primary"
                    size="large"
                    loading={confirmLoading}
                    onClick={handleConfirmPlan}
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                      marginRight: 16,
                    }}
                  >
                    ✅ Xác nhận kế hoạch này
                  </Button>

                  <Link
                    to="/create-planning"
                    onClick={() => {
                      // Xóa quitPlanId cũ để tạo kế hoạch mới
                      localStorage.removeItem("quitPlanId");
                    }}
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      color: "#333",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    📝 Tự lập kế hoạch khác
                  </Link>
                </div>
              </div>
            )}

            {/* Hiển thị thông báo đã xác nhận */}
            {isConfirmed && (
              <div className="suggest-confirmed">
                <div
                  style={{
                    textAlign: "center",
                    padding: 30,
                    backgroundColor: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    borderRadius: 8,
                    marginTop: 20,
                  }}
                >
                  <h3
                    style={{
                      color: "#52c41a",
                      marginBottom: 10,
                    }}
                  >
                    ✅ Kế hoạch đã được xác nhận!
                  </h3>
                  <p style={{ color: "#666", margin: 0 }}>
                    Kế hoạch sẽ được lưu và bạn có thể bắt đầu theo dõi tiến
                    trình cai thuốc. Chúc bạn thành công!
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SuggestPlaning;
