import React, { useEffect, useState } from "react";
import api from "../../configs/axios"; // Sử dụng instance đã cấu hình
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./SuggestPlaning.css";
import { useNavigate } from "react-router-dom";

function SuggestPlaning() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }
    async function fetchPlan() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlan(res.data[res.data.length - 1]);
        } else {
          setError("Không tìm thấy kế hoạch.");
        }
      } catch (err) {
        setError("Không lấy được kế hoạch đề xuất. Vui lòng thử lại!");
      }
      setLoading(false);
    }
    fetchPlan();
  }, [accountId, navigate]);

  return (
    <>
      <Navbar />
      <div className="suggest-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: 40 }}>
            {error}
          </div>
        ) : (
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
