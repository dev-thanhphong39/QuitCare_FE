import React, { useState, useEffect } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { Input, Radio, Modal, Button } from "antd";
import { useSelector } from "react-redux";
import "./Planning.css";
import planningBanner from "../../assets/images/planning1.png";



const initialState = {
  started_smoking_age: "",
  cigarettes_per_day: "",
  cigarettes_per_pack: "",
  timeToFirstCigarette: "",
  quitAttempts: "",
  longestQuitDuration: "",
  cravingWithoutSmoking: "",
  triggerSituation: "",
  quitIntentionTimeline: "",
  readinessLevel: "",
  quitReasons: "",
};

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

// Hàm đánh giá mức độ nghiện thuốc lá
function calcAddictionLevel(form) {
  let cigarettes = parseInt(form.cigarettes_per_day, 10);
  let pointCig = 0;
  if (cigarettes <= 10) pointCig = 0;
  else if (cigarettes <= 20) pointCig = 1;
  else if (cigarettes <= 30) pointCig = 2;
  else pointCig = 3;

  let pointTime = 0;
  switch (form.timeToFirstCigarette) {
    case "≤5 phút":
      pointTime = 3;
      break;
    case "6–30 phút":
      pointTime = 2;
      break;
    case "31–60 phút":
      pointTime = 1;
      break;
    case ">60 phút":
      pointTime = 0;
      break;
    default:
      pointTime = 0;
  }

  const total = pointCig + pointTime;
  let level = "";
  let message = "";
  if (total <= 2) {
    level = "Nhẹ";
    message =
      "Bạn có mức độ nghiện thuốc lá nhẹ. Đây là thời điểm rất tốt để bắt đầu cai thuốc. Hãy kiên trì, bạn hoàn toàn có thể thành công!";
  } else if (total <= 4) {
    level = "Trung bình";
    message =
      "Bạn có mức độ nghiện thuốc lá trung bình. Đừng lo lắng, với quyết tâm và sự hỗ trợ phù hợp, bạn sẽ vượt qua được thử thách này!";
  } else {
    level = "Cao";
    message =
      "Bạn có mức độ nghiện thuốc lá cao. Đừng nản lòng, hãy kiên trì và tìm kiếm sự hỗ trợ từ gia đình, bạn bè hoặc chuyên gia. Bạn chắc chắn sẽ làm được!";
  }
  return {
    total,
    level,
    message,
    summary: `Bạn hút khoảng ${form.cigarettes_per_day} điếu/ngày và hút điếu đầu tiên sau khi thức dậy ${form.timeToFirstCigarette}.`,
  };
}

// Thêm hàm tính toán kế hoạch đề xuất
const generateSuggestedPlan = (form) => {
  const cigarettesPerDay = parseInt(form.cigarettes_per_day);
  const addictionLevel = calcAddictionLevel(form);

  // Tính toán các giai đoạn dựa trên số điếu/ngày theo công thức mới
  const stages = [];
  let currentCigarettes = cigarettesPerDay;

  // Giai đoạn 1: Giảm 50% N
  const stage1Target = Math.max(1, Math.ceil(currentCigarettes * 0.5));
  stages.push({
    stageNumber: 1,
    week_range: "Tuần 1 - 4",
    targetCigarettes: stage1Target,
  });

  // Giai đoạn 2: Giảm 75% N (từ số ban đầu)
  const stage2Target = Math.max(1, Math.ceil(cigarettesPerDay * 0.25));
  stages.push({
    stageNumber: 2,
    week_range: "Tuần 5 - 8",
    targetCigarettes: stage2Target,
  });

  // Giai đoạn 3: Giảm 87.5% N (từ số ban đầu)
  const stage3Target = Math.max(1, Math.ceil(cigarettesPerDay * 0.125));
  stages.push({
    stageNumber: 3,
    week_range: "Tuần 9 - 12",
    targetCigarettes: stage3Target,
  });

  // Giai đoạn 4: Nếu số điếu <= 1 → Giai đoạn bỏ hoàn toàn
  if (stage3Target <= 1) {
    stages.push({
      stageNumber: 4,
      week_range: "Tuần 13 - 16",
      targetCigarettes: 0,
    });
  } else {
    // Nếu vẫn > 1, tiếp tục giảm xuống 1 điếu
    stages.push({
      stageNumber: 4,
      week_range: "Tuần 13 - 16",
      targetCigarettes: 1,
    });

    // Thêm giai đoạn 5: Cai hoàn toàn
    stages.push({
      stageNumber: 5,
      week_range: "Tuần 17 - 20",
      targetCigarettes: 0,
    });
  }

  return {
    addictionLevel:
      addictionLevel.level === "Nhẹ"
        ? "LOW"
        : addictionLevel.level === "Trung bình"
        ? "MEDIUM"
        : "HIGH",
    stages: stages,
    systemPlan: true,
    customPlan: false,
  };
};

function PlanPage() {
  const [form, setForm] = useState(initialState);
  const [showChoice, setShowChoice] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); // Modal yêu cầu nâng cấp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addictionInfo, setAddictionInfo] = useState(null);
  const navigate = useNavigate();

  const accountId = localStorage.getItem("accountId");
  const user = useSelector((state) => state.user); // Lấy thông tin user từ Redux

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }
    async function checkPlan() {
      try {
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        if (res.data && typeof res.data === "object" && res.data.id) {
          if (res.data.systemPlan === false) {
            navigate("/create-planning");
          } else {
            navigate("/suggest-planing");
          }
          return;
        }
      } catch (err) {
        // Nếu lỗi là 404 thì KHÔNG chuyển hướng, chỉ cho phép lập kế hoạch mới
        if (err?.response?.status === 404) {
          setLoading(false); // Cho phép hiển thị form khảo sát
        } else {
          //setError("Bạn chưa điền thông tin. Vui lòng điền đầy đủ thông tin!");
          setLoading(false);
        }
      }
    }
    checkPlan();
  }, [accountId, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const isFilled = () => {
    return (
      form.started_smoking_age &&
      form.cigarettes_per_day &&
      form.cigarettes_per_pack &&
      form.timeToFirstCigarette &&
      form.quitAttempts !== "" &&
      form.longestQuitDuration &&
      form.cravingWithoutSmoking !== "" &&
      form.triggerSituation &&
      form.quitIntentionTimeline &&
      form.readinessLevel &&
      form.quitReasons !== ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFilled()) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }

    // Kiểm tra role của người dùng
    if (user?.role === "GUEST") {
      // Nếu là GUEST, hiện modal yêu cầu nâng cấp
      setShowUpgradeModal(true);
      return;
    }

    // Nếu là CUSTOMER, tiếp tục xử lý bình thường
    const addiction = calcAddictionLevel(form);
    setAddictionInfo(addiction);
    setShowChoice(true);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigate("/"); // Chuyển đến trang mua gói
  };

  const handlePlanChoice = async (type) => {
    try {
      setError("");
      setShowChoice(false);
      setLoading(true);

      if (type === "recommend") {
        // Chỉ tính toán kế hoạch đề xuất, không gọi API
        const suggestedPlan = generateSuggestedPlan(form);

        // Lưu thông tin khảo sát và kế hoạch đề xuất vào localStorage
        localStorage.setItem("planSurvey", JSON.stringify(form));
        localStorage.setItem("suggestedPlan", JSON.stringify(suggestedPlan));

        navigate("/suggest-planing");
      } else {
        // Tự lập kế hoạch - gọi API như cũ
        const payload = {
          started_smoking_age: parseInt(form.started_smoking_age),
          cigarettes_per_day: parseInt(form.cigarettes_per_day),
          cigarettes_per_pack: parseInt(form.cigarettes_per_pack),
          timeToFirstCigarette: mapTime(form.timeToFirstCigarette),
          status: "ACTIVE",
          quitAttempts: mapQuitAttempts(form.quitAttempts),
          longestQuitDuration: mapDuration(form.longestQuitDuration),
          cravingWithoutSmoking: form.cravingWithoutSmoking === "true",
          triggerSituation: form.triggerSituation.trim(),
          quitIntentionTimeline: mapTimeline(form.quitIntentionTimeline),
          readinessLevel: mapReadiness(form.readinessLevel),
          quitReasons: form.quitReasons,
        };

        await api.post(`/smoking-status/account/${accountId}`, payload);
        const res = await api.post(`/v1/customers/${accountId}/quit-plans`, {
          systemPlan: false,
        });

        localStorage.setItem("quitPlanId", res.data.id);
        localStorage.setItem("planSurvey", JSON.stringify(payload));
        navigate("/create-planning");
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        setError(
          "Bạn không có quyền lập kế hoạch. Vui lòng đăng nhập bằng tài khoản khách hàng."
        );
      } else if (err?.response?.status === 409) {
        setError("Bạn đã có kế hoạch. Không thể tạo thêm.");
      } else {
        setError("Bạn chưa điền thông tin. Vui lòng điền đầy đủ thông tin!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="planpage-container">
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="planpage-banner">
        <img
          src={planningBanner}
          alt="QuitCare Planning Banner"
          className="planpage-banner-image"
        />
        <div className="planpage-banner-overlay">
          <h1 className="planpage-banner-title">
            Bắt đầu hành trình cai thuốc của bạn
          </h1>
          <p className="planpage-banner-subtitle">
            vì sức khỏe, vì gia đình, vì chính bạn.
          </p>
        </div>
      </div>

      <div className="planpage-container">
        <h2 className="planpage-title">Thông tin khảo sát</h2>
        <form className="planpage-form">
          <div className="planpage-grid">
            <div>
              <div className="planpage-question">
                <b>[1]</b> Bạn bắt đầu hút thuốc từ năm bao nhiêu tuổi?
              </div>
              <input
                type="number"
                name="started_smoking_age"
                min="10"
                max="100"
                value={form.started_smoking_age}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Nhập tuổi"
              />
              <div className="planpage-question">
                <b>[2]</b> Hiện tại hút bao nhiêu điếu/ngày?
              </div>
              <input
                type="number"
                name="cigarettes_per_day"
                min="1"
                max="100"
                value={form.cigarettes_per_day}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số điếu/ngày"
              />
              <div className="planpage-question">
                <b>[3]</b> Một bao có bao nhiêu điếu?
              </div>
              <input
                type="number"
                name="cigarettes_per_pack"
                min="1"
                max="50"
                value={form.cigarettes_per_pack}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số điếu/bao"
              />
              <div className="planpage-question">
                <b>[4]</b> Sau khi thức dậy bao lâu bạn hút điếu đầu?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="timeToFirstCigarette"
                    value="≤5 phút"
                    checked={form.timeToFirstCigarette === "≤5 phút"}
                    onChange={handleChange}
                  />
                  ≤5 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeToFirstCigarette"
                    value="6–30 phút"
                    checked={form.timeToFirstCigarette === "6–30 phút"}
                    onChange={handleChange}
                  />
                  6–30 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeToFirstCigarette"
                    value="31–60 phút"
                    checked={form.timeToFirstCigarette === "31–60 phút"}
                    onChange={handleChange}
                  />
                  31–60 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeToFirstCigarette"
                    value=">60 phút"
                    checked={form.timeToFirstCigarette === ">60 phút"}
                    onChange={handleChange}
                  />
                  &gt;60 phút
                </label>
              </div>
              <div className="planpage-question">
                <b>[5]</b> Bạn đã từng cố gắng cai thuốc chưa? (Số lần)
              </div>
              <input
                type="number"
                name="quitAttempts"
                min="0"
                max="100"
                value={form.quitAttempts}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số lần"
              />
              <div className="planpage-question">
                <b>[6]</b> Thời gian dài nhất từng không hút thuốc?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="longestQuitDuration"
                    value="LESS_THAN_1_DAY"
                    checked={form.longestQuitDuration === "LESS_THAN_1_DAY"}
                    onChange={handleChange}
                  />
                  Ít hơn 1 ngày
                </label>
                <label>
                  <input
                    type="radio"
                    name="longestQuitDuration"
                    value="BETWEEN_1_AND_3_DAYS"
                    checked={
                      form.longestQuitDuration === "BETWEEN_1_AND_3_DAYS"
                    }
                    onChange={handleChange}
                  />
                  Giữa 1 và 3 ngày
                </label>
                <label>
                  <input
                    type="radio"
                    name="longestQuitDuration"
                    value="ONE_WEEK"
                    checked={form.longestQuitDuration === "ONE_WEEK"}
                    onChange={handleChange}
                  />
                  1 tuần
                </label>
                <label>
                  <input
                    type="radio"
                    name="longestQuitDuration"
                    value="MORE_THAN_ONE_WEEK"
                    checked={form.longestQuitDuration === "MORE_THAN_ONE_WEEK"}
                    onChange={handleChange}
                  />
                  Hơn 1 tuần
                </label>
              </div>
              <div className="planpage-question">
                <b>[7]</b> Bạn có cảm thấy khó chịu nếu không hút?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="cravingWithoutSmoking"
                    value="true"
                    checked={form.cravingWithoutSmoking === "true"}
                    onChange={handleChange}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    name="cravingWithoutSmoking"
                    value="false"
                    checked={form.cravingWithoutSmoking === "false"}
                    onChange={handleChange}
                  />
                  Không
                </label>
              </div>
              <div className="planpage-question">
                <b>[8]</b> Bạn hút nhiều hơn khi nào?
              </div>
              <input
                type="text"
                name="triggerSituation"
                value={form.triggerSituation}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Ví dụ: căng thẳng, sau bữa ăn..."
              />
            </div>
            <div>
              <div className="planpage-question">
                <b>[9]</b> Ý định cai thuốc trong bao lâu tới?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="quitIntentionTimeline"
                    value="7 ngày"
                    checked={form.quitIntentionTimeline === "7 ngày"}
                    onChange={handleChange}
                  />
                  7 ngày
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntentionTimeline"
                    value="1 tháng"
                    checked={form.quitIntentionTimeline === "1 tháng"}
                    onChange={handleChange}
                  />
                  1 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntentionTimeline"
                    value="3 tháng"
                    checked={form.quitIntentionTimeline === "3 tháng"}
                    onChange={handleChange}
                  />
                  3 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntentionTimeline"
                    value="5 tháng"
                    checked={form.quitIntentionTimeline === "5 tháng"}
                    onChange={handleChange}
                  />
                  5 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntentionTimeline"
                    value="Chưa chắc"
                    checked={form.quitIntentionTimeline === "Chưa chắc"}
                    onChange={handleChange}
                  />
                  Chưa chắc
                </label>
              </div>
              <div className="planpage-question">
                <b>[10]</b> Mức độ sẵn sàng cai thuốc
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="readinessLevel"
                    value="Chưa sẵn sàng"
                    checked={form.readinessLevel === "Chưa sẵn sàng"}
                    onChange={handleChange}
                  />
                  Chưa sẵn sàng
                </label>
                <label>
                  <input
                    type="radio"
                    name="readinessLevel"
                    value="Đang cân nhắc"
                    checked={form.readinessLevel === "Đang cân nhắc"}
                    onChange={handleChange}
                  />
                  Đang cân nhắc
                </label>
                <label>
                  <input
                    type="radio"
                    name="readinessLevel"
                    value="Rất sẵn sàng"
                    checked={form.readinessLevel === "Rất sẵn sàng"}
                    onChange={handleChange}
                  />
                  Rất sẵn sàng
                </label>
              </div>
              <div className="planpage-question">
                <b>[11]</b> Lý do chính muốn cai thuốc ?
              </div>
              <Radio.Group
                name="quitReasons"
                onChange={handleChange}
                options={[
                  { value: "Improving_health", label: "Cải thiện sức khỏe" },
                  {
                    value: "Family_loved_ones",
                    label: "Vì gia đình và người thân",
                  },
                  { value: "Financial_pressure", label: "Áp lực tài chính" },
                  {
                    value: "Feeling_tired_of_addiction",
                    label: "Cảm thấy mệt mỏi với việc nghiện thuốc",
                  },
                  {
                    value: "Wanting_to_set_an_example_for_children",
                    label: "Muốn làm gương cho con cái",
                  },
                  {
                    value: "Being_banned_from_smoking_at_work_home",
                    label: "Bị cấm hút thuốc ở nơi làm việc/nhà",
                  },
                ]}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="planpage-submit"
            type="submit"
          >
            Gửi thông tin
          </button>
          {error && <div className="planpage-error">{error}</div>}
        </form>

        {/* Modal yêu cầu nâng cấp cho GUEST */}
        <Modal
          title="🎯 Nâng cấp tài khoản"
          open={showUpgradeModal}
          onCancel={() => setShowUpgradeModal(false)}
          footer={null}
          centered
          width={500}
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                fontSize: "18px",
                marginBottom: "16px",
                color: "#1890ff",
              }}
            >
              💡 Để sử dụng tính năng lập kế hoạch cai thuốc
            </div>
            <div
              style={{
                fontSize: "16px",
                marginBottom: "24px",
                color: "#666",
              }}
            >
              Bạn cần nâng cấp lên tài khoản <b>CUSTOMER</b> để trải nghiệm đầy
              đủ các tính năng của QuitCare.
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <Button size="large" onClick={() => setShowUpgradeModal(false)}>
                Để sau
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleUpgrade}
                style={{
                  background:
                    "linear-gradient(90deg, #52c41a 60%, #73d13d 100%)",
                  border: "none",
                }}
              >
                🚀 Nâng cấp ngay
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal chọn phương án cho CUSTOMER */}
        {showChoice && (
          <div
            className="planpage-choice-modal"
            onClick={() => setShowChoice(false)}
          >
            <div
              className="planpage-choice-box"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hiển thị đánh giá mức độ nghiện */}
              {addictionInfo && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: 16,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", color: "#495057" }}>
                    📊 Đánh giá mức độ nghiện thuốc lá
                  </h4>
                  <div style={{ marginBottom: 8, fontSize: 14 }}>
                    {addictionInfo.summary}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Mức độ nghiện: </b>
                    <span
                      style={{
                        color:
                          addictionInfo.level === "Cao"
                            ? "#e74c3c"
                            : addictionInfo.level === "Trung bình"
                            ? "#f39c12"
                            : "#27ae60",
                        fontWeight: "bold",
                      }}
                    >
                      {addictionInfo.level}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#6c757d",
                      fontStyle: "italic",
                    }}
                  >
                    {addictionInfo.message}
                  </div>
                </div>
              )}

              <h3>Bạn muốn chọn phương án nào?</h3>
              <div className="planpage-choice-btns">
                <button
                  className="planpage-choice-btn recommend"
                  type="button"
                  onClick={() => handlePlanChoice("recommend")}
                >
                  Đề xuất
                </button>
                <button
                  className="planpage-choice-btn self"
                  type="button"
                  onClick={() => handlePlanChoice("self")}
                >
                  Tự lập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PlanPage;
