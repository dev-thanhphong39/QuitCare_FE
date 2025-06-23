import React, { useState } from "react";
import "./CreatePlanning.css";

const initialStages = [
  { stage: "", value: "" },
  { stage: "", value: "" },
  { stage: "", value: "" },
  { stage: "", value: "" },
];

function CreatePlanning() {
  const [stages, setStages] = useState(initialStages);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (idx, field, val) => {
    if (confirmed) return;
    const newStages = stages.map((s, i) =>
      i === idx ? { ...s, [field]: val } : s
    );
    setStages(newStages);
  };

  const handleAddStage = () => {
    if (confirmed) return;
    setStages([...stages, { stage: "", value: "" }]);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    // Gửi dữ liệu lên server nếu cần
    // Ví dụ: api.post('/v1/customers/plan-self', { stages })
  };

  return (
    <div style={{ padding: 32 }}>
      <h3 style={{ fontWeight: 700, fontSize: 26 }}>Bảng Tự Lập Kế Hoạch</h3>
      <div style={{ fontWeight: 600, fontSize: 20 }}>
        - Thời gian (từ tuần - đến tuần) : ...–...<br />
        - Nhập số điếu/ngày trong giai đoạn đó : .....
      </div>
      <table style={{ width: "90%", margin: "24px 0", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #222", padding: 12, fontSize: 18 }}>
              Giai đoạn (Từ tuần–đến tuần)
            </th>
            <th style={{ border: "1px solid #222", padding: 12, fontSize: 18 }}>
              Giới hạn số thuốc mỗi ngày
            </th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #222", padding: 10 }}>
                <input
                  type="text"
                  placeholder="... → ..."
                  value={s.stage}
                  disabled={confirmed}
                  onChange={e => handleChange(idx, "stage", e.target.value)}
                  style={{
                    width: "90%",
                    fontSize: 16,
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: 6,
                  }}
                />
              </td>
              <td style={{ border: "1px solid #222", padding: 10 }}>
                <input
                  type="number"
                  min="0"
                  placeholder="....."
                  value={s.value}
                  disabled={confirmed}
                  onChange={e => handleChange(idx, "value", e.target.value)}
                  style={{
                    width: "90%",
                    fontSize: 16,
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: 6,
                  }}
                />
              </td>
            </tr>
          ))}
          {!confirmed && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: 16 }}>
                <button
                  type="button"
                  onClick={handleAddStage}
                  style={{
                    background: "#23b04a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 24,
                    padding: "10px 28px",
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  Thêm giai đoạn
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ textAlign: "right", width: "90%" }}>
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          style={{
            background: "#002b8c",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "14px 48px",
            fontWeight: 600,
            fontSize: 20,
            cursor: confirmed ? "not-allowed" : "pointer",
          }}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}

export default CreatePlanning;