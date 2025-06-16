import React, { useState } from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import "./Planning.css";

const initialState = {
  startAge: "",
  cigarettesPerDay: "",
  cigarettesPerDayOther: "",
  afterWake: "",
  triedQuit: "",
  longestNoSmoke: "",
  support: "",
  hardToQuit: "",
  smokeMore: "",
  quitIntent: "",
  readiness: "",
  reasons: [],
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newReasons = [...form.reasons];
      if (checked) {
        if (newReasons.length < 2) newReasons.push(value);
      } else {
        newReasons = newReasons.filter((r) => r !== value);
      }
      setForm({ ...form, reasons: newReasons });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <>
      <Navbar />
      <div className="planning-container">
        <h2 className="planning-title">Thông tin khảo sát</h2>
        <form className="planning-form">
          <div className="planning-grid">
            <div>
              <div className="planning-question">
                <b>[1]</b> Bạn bắt đầu hút thuốc từ năm bao nhiêu tuổi?
              </div>
              <input
                type="number"
                name="startAge"
                min="10"
                max="100"
                value={form.startAge}
                onChange={handleChange}
                className="planning-input"
                placeholder="Nhập tuổi"
              />

              <div className="planning-question">
                <b>[2]</b> Hiện tại hút bao nhiêu điếu/ngày?
              </div>
              <div className="planning-options">
                <label>
                  <input
                    type="radio"
                    name="cigarettesPerDay"
                    value="<10"
                    checked={form.cigarettesPerDay === "<10"}
                    onChange={handleChange}
                  />
                  &lt;10 điếu
                </label>
                <label>
                  <input
                    type="radio"
                    name="cigarettesPerDay"
                    value="11-20"
                    checked={form.cigarettesPerDay === "11-20"}
                    onChange={handleChange}
                  />
                  11–20 điếu
                </label>
                <label>
                  <input
                    type="radio"
                    name="cigarettesPerDay"
                    value="21-30"
                    checked={form.cigarettesPerDay === "21-30"}
                    onChange={handleChange}
                  />
                  21–30 điếu
                </label>
                <label>
                  <input
                    type="radio"
                    name="cigarettesPerDay"
                    value=">30"
                    checked={form.cigarettesPerDay === ">30"}
                    onChange={handleChange}
                  />
                  &gt;30 điếu
                </label>
                {form.cigarettesPerDay === ">30" && (
                  <input
                    type="text"
                    name="cigarettesPerDayOther"
                    value={form.cigarettesPerDayOther}
                    onChange={handleChange}
                    className="planning-input"
                    placeholder="Nhập cụ thể"
                  />
                )}
              </div>

              <div className="planning-question">
                <b>[3]</b> Sau khi thức dậy bao lâu bạn hút điếu đầu?
              </div>
              <div className="planning-options">
                <label>
                  <input
                    type="radio"
                    name="afterWake"
                    value="≤5 phút"
                    checked={form.afterWake === "≤5 phút"}
                    onChange={handleChange}
                  />
                  ≤5 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="afterWake"
                    value="6–30 phút"
                    checked={form.afterWake === "6–30 phút"}
                    onChange={handleChange}
                  />
                  6–30 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="afterWake"
                    value="31–60 phút"
                    checked={form.afterWake === "31–60 phút"}
                    onChange={handleChange}
                  />
                  31–60 phút
                </label>
                <label>
                  <input
                    type="radio"
                    name="afterWake"
                    value=">60 phút"
                    checked={form.afterWake === ">60 phút"}
                    onChange={handleChange}
                  />
                  &gt;60 phút
                </label>
              </div>

              <div className="planning-question">
                <b>[4]</b> Bạn đã từng cố gắng cai thuốc chưa?
              </div>
              <input
                type="text"
                name="triedQuit"
                value={form.triedQuit}
                onChange={handleChange}
                className="planning-input"
                placeholder="..."
              />

              <div className="planning-question">
                <b>[5]</b> Thời gian dài nhất từng không hút thuốc?
              </div>
              <input
                type="text"
                name="longestNoSmoke"
                value={form.longestNoSmoke}
                onChange={handleChange}
                className="planning-input"
                placeholder="..."
              />

              <div className="planning-question">
                <b>[6]</b> Có người thân/bạn bè ủng hộ việc cai thuốc?
              </div>
              <input
                type="text"
                name="support"
                value={form.support}
                onChange={handleChange}
                className="planning-input"
                placeholder="..."
              />

              <div className="planning-question">
                <b>[7]</b> Bạn có cảm thấy khó chịu nếu không hút?
              </div>
              <input
                type="text"
                name="hardToQuit"
                value={form.hardToQuit}
                onChange={handleChange}
                className="planning-input"
                placeholder="..."
              />

              <div className="planning-question">
                <b>[8]</b> Bạn hút nhiều hơn khi nào?
              </div>
              <input
                type="text"
                name="smokeMore"
                value={form.smokeMore}
                onChange={handleChange}
                className="planning-input"
                placeholder="..."
              />
            </div>

            <div>
              <div className="planning-question">
                <b>[9]</b> Ý định cai thuốc trong bao lâu tới?
              </div>
              <div className="planning-options">
                <label>
                  <input
                    type="radio"
                    name="quitIntent"
                    value="7 ngày"
                    checked={form.quitIntent === "7 ngày"}
                    onChange={handleChange}
                  />
                  7 ngày
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntent"
                    value="1 tháng"
                    checked={form.quitIntent === "1 tháng"}
                    onChange={handleChange}
                  />
                  1 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntent"
                    value="3 tháng"
                    checked={form.quitIntent === "3 tháng"}
                    onChange={handleChange}
                  />
                  3 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntent"
                    value="5 tháng"
                    checked={form.quitIntent === "5 tháng"}
                    onChange={handleChange}
                  />
                  5 tháng
                </label>
                <label>
                  <input
                    type="radio"
                    name="quitIntent"
                    value="Chưa chắc"
                    checked={form.quitIntent === "Chưa chắc"}
                    onChange={handleChange}
                  />
                  Chưa chắc
                </label>
              </div>

              <div className="planning-question">
                <b>[10]</b> Mức độ sẵn sàng cai thuốc
              </div>
              <div className="planning-options">
                <label>
                  <input
                    type="radio"
                    name="readiness"
                    value="Chưa sẵn sàng"
                    checked={form.readiness === "Chưa sẵn sàng"}
                    onChange={handleChange}
                  />
                  Chưa sẵn sàng
                </label>
                <label>
                  <input
                    type="radio"
                    name="readiness"
                    value="Đang cân nhắc"
                    checked={form.readiness === "Đang cân nhắc"}
                    onChange={handleChange}
                  />
                  Đang cân nhắc
                </label>
                <label>
                  <input
                    type="radio"
                    name="readiness"
                    value="Rất sẵn sàng"
                    checked={form.readiness === "Rất sẵn sàng"}
                    onChange={handleChange}
                  />
                  Rất sẵn sàng
                </label>
              </div>

              <div className="planning-question">
                <b>[11]</b> Lý do chính muốn cai thuốc (chọn tối đa 2)?
              </div>
              <div className="planning-options planning-options-col">
                {reasonsList.map((reason) => (
                  <label key={reason}>
                    <input
                      type="checkbox"
                      name="reasons"
                      value={reason}
                      checked={form.reasons.includes(reason)}
                      onChange={handleChange}
                      disabled={
                        !form.reasons.includes(reason) &&
                        form.reasons.length >= 2
                      }
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button className="planning-submit" type="submit">
            Gửi thông tin
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default PlanPage;
