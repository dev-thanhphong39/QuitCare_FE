import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./SuggestPlaning.css";
import { useNavigate } from "react-router-dom";
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
    // Nếu chưa đăng nhập thì chuyển về trang đăng nhập
    if (!accountId) {
      navigate("/login");
      return;
    }
    // Hàm lấy kế hoạch đề xuất từ API
    async function fetchPlan() {
      setLoading(true); // Bắt đầu loading
      setError(""); // Xóa lỗi cũ
      try {
        // Gọi API lấy kế hoạch cai thuốc của user
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        console.log("API trả về:", res.data);
        // Nếu API trả về object (đã có kế hoạch)
        if (res.data && !Array.isArray(res.data)) {
          setPlan(res.data); // Lưu kế hoạch vào state
          // Không cần kiểm tra isAgreedPlan từ backend nữa, chỉ dùng FE
        } else {
          setError("Không tìm thấy kế hoạch."); // Không có kế hoạch
        }
      } catch (err) {
        setError("Không lấy được kế hoạch đề xuất. Vui lòng thử lại!"); // Lỗi gọi API
      }
      setLoading(false); // Kết thúc loading
    }
    fetchPlan();
  }, [accountId, navigate]);

  // Hàm xử lý xác nhận kế hoạch
  const handleConfirmPlan = async () => {
    setConfirmLoading(true);
    try {
      // Sửa lại API call theo đúng format
      await api.put(`/v1/customers/${accountId}/quit-plans/${plan.id}`, {
        isAgreedPlan: true,
        quitPlanStatus: "DRAFT",
      });

      // Đánh dấu đã xác nhận
      setIsConfirmed(true);
      localStorage.setItem(`plan_confirmed_${accountId}`, "true"); // Lưu trạng thái đã xác nhận vào localStorage

      Modal.success({
        title: "Xác nhận thành công!",
        content: "Kế hoạch cai thuốc đã được xác nhận. Chúc bạn thành công!",
        okText: "Đóng",
      });
    } catch (err) {
      Modal.error({
        title: "Lỗi xác nhận",
        content: "Không thể xác nhận kế hoạch. Vui lòng thử lại!",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm chuyển sang tự lập kế hoạch
  const handleCreateOwnPlan = () => {
    Modal.confirm({
      title: "Chuyển sang tự lập kế hoạch",
      content:
        "Bạn có chắc chắn muốn bỏ kế hoạch đề xuất này và tự tạo kế hoạch riêng?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        navigate("/create-planning");
      },
    });
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
                  <p style={{ color: "#666", marginBottom: 20 }}>
                    Kế hoạch sẽ được lưu và bạn có thể bắt đầu
                    theo dõi tiến trình cai thuốc. Chúc bạn thành công!
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

                  <Button
                    size="large"
                    onClick={handleCreateOwnPlan}
                    style={{
                      backgroundColor: "#f0f0f0",
                      borderColor: "#d9d9d9",
                      color: "#333",
                    }}
                  >
                    📝 Tự lập kế hoạch khác
                  </Button>
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
                    Bạn có thể bắt đầu theo dõi tiến trình cai thuốc của mình.
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
