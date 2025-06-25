import React, { useEffect, useState } from "react";
import api from "../../configs/axios"; // Import cấu hình axios để gọi API
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./SuggestPlaning.css";
import { useNavigate } from "react-router-dom";

function SuggestPlaning() {
  // State lưu kế hoạch, trạng thái loading và lỗi
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");

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
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SuggestPlaning;
