import React, { useState } from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import "./Planning.css";

const initialState = {
  started_smoking_age: "",
  cigarettes_per_day: "",
  cigarettes_per_pack: "",
  time_to_first_cigarettes: "",
  quit_attempts: "",
  longest_quit_duration: "",
  has_suport_network: "",
  craving_without_smoking: "",
  trigger_situation: "",
  quit_intention_timeline: "",
  readiness_level: "",
  quit_reasons: [],
};

const reasonsList = [
  "Cải thiện sức khỏe",
  "Gia đình / người thân",
  "Áp lực tài chính",
  "Cảm thấy mệt mỏi vì nghiện",
  "Muốn làm gương cho con cái",
  "Bị cấm hút tại nơi làm việc / gia đình",
];

function PlanPage() {
  const [form, setForm] = useState(initialState);
  const [showChoice, setShowChoice] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newReasons = [...form.quit_reasons];
      if (checked) {
        if (newReasons.length < 2) newReasons.push(value);
      } else {
        newReasons = newReasons.filter((r) => r !== value);
      }
      setForm({ ...form, quit_reasons: newReasons });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError("");
  };

  const isFilled = () => {
    // Kiểm tra các trường bắt buộc
    return (
      form.started_smoking_age &&
      form.cigarettes_per_day &&
      form.cigarettes_per_pack &&
      form.time_to_first_cigarettes &&
      form.quit_attempts !== "" &&
      form.longest_quit_duration &&
      form.has_suport_network &&
      form.craving_without_smoking &&
      form.trigger_situation &&
      form.quit_intention_timeline &&
      form.readiness_level &&
      form.quit_reasons.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFilled()) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }
    console.log(form);
    setShowChoice(true);
  };

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
                    name="time_to_first_cigarettes"
                    value="≤5 phút"
                    checked={form.time_to_first_cigarettes === "≤5 phút"}
                    onChange={handleChange}
                  />
                  ≤5 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="time_to_first_cigarettes"
                    value="6–30 phút"
                    checked={form.time_to_first_cigarettes === "6–30 phút"}
                    onChange={handleChange}
                  />
                  6–30 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="time_to_first_cigarettes"
                    value="31–60 phút"
                    checked={form.time_to_first_cigarettes === "31–60 phút"}
                    onChange={handleChange}
                  />
                  31–60 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="time_to_first_cigarettes"
                    value=">60 phút"
                    checked={form.time_to_first_cigarettes === ">60 phút"}
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
                name="quit_attempts"
                min="0"
                max="100"
                value={form.quit_attempts}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số lần"
              />
              <div className="planpage-question">
                <b>[6]</b> Thời gian dài nhất từng không hút thuốc?
              </div>
              <input
                type="text"
                name="longest_quit_duration"
                value={form.longest_quit_duration}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Ví dụ: 1 tuần, 1 tháng..."
              />
              <div className="planpage-question">
                <b>[7]</b> Có người thân/bạn bè ủng hộ việc cai thuốc?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="has_suport_network"
                    value="Có"
                    checked={form.has_suport_network === "Có"}
                    onChange={handleChange}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    name="has_suport_network"
                    value="Không"
                    checked={form.has_suport_network === "Không"}
                    onChange={handleChange}
                  />
                  Không
                </label>
              </div>
              <div className="planpage-question">
                <b>[8]</b> Bạn có cảm thấy khó chịu nếu không hút?
              </div>
              <input
                type="text"
                name="craving_without_smoking"
                value={form.craving_without_smoking}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Mô tả cảm giác"
              />
              <div className="planpage-question">
                <b>[9]</b> Bạn hút nhiều hơn khi nào? (Tình huống kích hoạt)
              </div>
              <input
                type="text"
                name="trigger_situation"
                value={form.trigger_situation}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Ví dụ: khi căng thẳng, sau bữa ăn..."
              />
            </div>
            <div>
              <div className="planpage-question">
                <b>[10]</b> Ý định cai thuốc trong bao lâu tới?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="quit_intention_timeline"
                    value="7 ngày"
                    checked={form.quit_intention_timeline === "7 ngày"}
                    onChange={handleChange}
                  />
                  7 ngày
                </label>
                <label>
                  <input
                    type="radio"
                    name="quit_intention_timeline"
                    value="1 tháng"
                    checked={form.quit_intention_timeline === "1 tháng"}
                    onChange={handleChange}
                  />
                  1 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quit_intention_timeline"
                    value="3 tháng"
                    checked={form.quit_intention_timeline === "3 tháng"}
                    onChange={handleChange}
                  />
                  3 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quit_intention_timeline"
                    value="5 tháng"
                    checked={form.quit_intention_timeline === "5 tháng"}
                    onChange={handleChange}
                  />
                  5 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quit_intention_timeline"
                    value="Chưa chắc"
                    checked={form.quit_intention_timeline === "Chưa chắc"}
                    onChange={handleChange}
                  />
                  Chưa chắc
                </label>
              </div>
              <div className="planpage-question">
                <b>[11]</b> Mức độ sẵn sàng cai thuốc
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="readiness_level"
                    value="Chưa sẵn sàng"
                    checked={form.readiness_level === "Chưa sẵn sàng"}
                    onChange={handleChange}
                  />
                  Chưa sẵn sàng
                </label>
                <label>
                  <input
                    type="radio"
                    name="readiness_level"
                    value="Đang cân nhắc"
                    checked={form.readiness_level === "Đang cân nhắc"}
                    onChange={handleChange}
                  />
                  Đang cân nhắc
                </label>
                <label>
                  <input
                    type="radio"
                    name="readiness_level"
                    value="Rất sẵn sàng"
                    checked={form.readiness_level === "Rất sẵn sàng"}
                    onChange={handleChange}
                  />
                  Rất sẵn sàng
                </label>
              </div>
              <div className="planpage-question">
                <b>[12]</b> Lý do chính muốn cai thuốc (chọn tối đa 2)?
              </div>
              <div className="planpage-options planpage-options-col">
                {reasonsList.map((reason) => (
                  <label key={reason}>
                    <input
                      type="checkbox"
                      name="quit_reasons"
                      value={reason}
                      checked={form.quit_reasons.includes(reason)}
                      onChange={handleChange}
                      disabled={
                        !form.quit_reasons.includes(reason) &&
                        form.quit_reasons.length >= 2
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
                <button className="planpage-choice-btn recommend">
                  Đề xuất
                </button>
                <button className="planpage-choice-btn self">Tự lập</button>
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
