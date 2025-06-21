import React, { useState, useEffect } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import "./Planning.css";

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
  quitReasons: [],
};

const reasonsList = [
  "Cải thiện sức khỏe",
  "Gia đình / người thân",
  "Áp lực tài chính",
  "Cảm thấy mệt mỏi vì nghiện",
  "Muốn làm gương cho con cái",
  "Bị cấm hút tại nơi làm việc / gia đình",
];

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

const mapReasons = (list) => {
  return list.map((item) => {
    switch (item) {
      case "Cải thiện sức khỏe":
        return "Improving_health";
      case "Gia đình / người thân":
        return "Family_loved_ones";
      case "Áp lực tài chính":
        return "Financial_pressure";
      case "Cảm thấy mệt mỏi vì nghiện":
        return "Feeling_tired_of_addiction";
      case "Muốn làm gương cho con cái":
        return "Wanting_to_set_an_example_for_children";
      case "Bị cấm hút tại nơi làm việc / gia đình":
        return "Being_banned_from_smoking_at_work_home";
      default:
        return "";
    }
  });
};

function PlanPage() {
  const [form, setForm] = useState(initialState);
  const [showChoice, setShowChoice] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }
    async function checkPlan() {
      try {
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          navigate("/suggest-planing");
          return;
        }
      } catch (err) {}
      setLoading(false);
    }
    checkPlan();
  }, [accountId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newReasons = [...form.quitReasons];
      if (checked) {
        if (newReasons.length < 2) newReasons.push(value);
      } else {
        newReasons = newReasons.filter((r) => r !== value);
      }
      setForm({ ...form, quitReasons: newReasons });
    } else {
      setForm({ ...form, [name]: value });
    }
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
      form.quitReasons.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFilled()) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }
    setShowChoice(true);
  };

  const handlePlanChoice = async (type) => {
    try {
      setError("");
      setShowChoice(false);
      setLoading(true);

      const payload = {
        started_smoking_age: parseInt(form.started_smoking_age),
        cigarettes_per_day: parseInt(form.cigarettes_per_day),
        cigarettes_per_pack: parseInt(form.cigarettes_per_pack),
        timeToFirstCigarette: mapTime(form.timeToFirstCigarette),
        quitAttempts: mapQuitAttempts(form.quitAttempts),
        longestQuitDuration: mapDuration(form.longestQuitDuration),
        cravingWithoutSmoking: form.cravingWithoutSmoking === "true",
        triggerSituation: form.triggerSituation.trim(),
        quitIntentionTimeline: mapTimeline(form.quitIntentionTimeline),
        readinessLevel: mapReadiness(form.readinessLevel),
        quitReasons: mapReasons(form.quitReasons),
      };

      console.log("accountId:", accountId);
      console.log("Payload gửi lên:", payload);

      await api.post(`/smoking-status/account/${accountId}`, payload);

      await api.post(`/v1/customers/${accountId}/quit-plans`, {
        systemPlan: type === "recommend",
      });

      navigate("/suggest-planing");
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu kế hoạch. Vui lòng thử lại!");
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
                <b>[8]</b> Bạn hút nhiều hơn khi nào? (Tình huống kích hoạt)
              </div>
              <input
                type="text"
                name="triggerSituation"
                value={form.triggerSituation}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Ví dụ: khi căng thẳng, sau bữa ăn..."
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
                <b>[11]</b> Lý do chính muốn cai thuốc (chọn tối đa 2)?
              </div>
              <div className="planpage-options planpage-options-col">
                {reasonsList.map((reason) => (
                  <label key={reason}>
                    <input
                      type="checkbox"
                      name="quitReasons"
                      value={reason}
                      checked={form.quitReasons.includes(reason)}
                      onChange={handleChange}
                      disabled={
                        !form.quitReasons.includes(reason) &&
                        form.quitReasons.length >= 2
                      }
                    />
                    {reason}
                  </label>
                ))}
              </div>
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
        {showChoice && (
          <div
            className="planpage-choice-modal"
            onClick={() => setShowChoice(false)}
          >
            <div
              className="planpage-choice-box"
              onClick={(e) => e.stopPropagation()}
            >
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
