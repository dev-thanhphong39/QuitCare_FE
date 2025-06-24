import React, { useState } from "react";
import { Button, Modal, Input, Table } from "antd";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./CreatePlanning.css";
import create1 from "../../assets/images/create1.png";

// Hàm tạo giai đoạn mới, mỗi giai đoạn có 1 dòng tuần mặc định
const initialStage = () => ({
  weeks: [{ week: "", cigarettes: "" }],
});

function CreatePlanning() {
  // State lưu danh sách các giai đoạn (mỗi giai đoạn là 1 object có mảng weeks)
  const [stages, setStages] = useState([initialStage()]);
  // State xác nhận: true thì không cho sửa nữa
  const [confirmed, setConfirmed] = useState(false);
  // State mở modal xác nhận
  const [modalOpen, setModalOpen] = useState(false);

  // Lấy accountId và quitPlanId từ localStorage
  const accountId = localStorage.getItem("accountId");
  const quitPlanId = localStorage.getItem("quitPlanId");

  // Thêm dòng tuần mới vào 1 giai đoạn
  const handleAddRow = (stageIdx) => {
    if (confirmed) return; // Nếu đã xác nhận thì không cho thêm
    const newStages = [...stages];
    newStages[stageIdx].weeks.push({ week: "", cigarettes: "" });
    setStages(newStages);
  };

  // Thêm giai đoạn mới
  const handleAddStage = () => {
    if (confirmed) return;
    setStages([...stages, initialStage()]);
  };

  // Xử lý thay đổi input (tuần hoặc số điếu)
  const handleChange = (stageIdx, rowIdx, field, value) => {
    if (confirmed) return;
    const newStages = [...stages];
    newStages[stageIdx].weeks[rowIdx][field] = value;
    setStages(newStages);
  };

  // Xóa dòng tuần trong 1 giai đoạn (chỉ xóa nếu còn nhiều hơn 1 dòng)
  const handleDeleteRow = (stageIdx, rowIdx) => {
    if (confirmed) return;
    const newStages = [...stages];
    if (newStages[stageIdx].weeks.length > 1) {
      newStages[stageIdx].weeks.splice(rowIdx, 1);
      setStages(newStages);
    }
  };

  // Xóa giai đoạn (chỉ xóa nếu còn nhiều hơn 1 giai đoạn)
  const handleDeleteStage = (stageIdx) => {
    if (confirmed) return;
    if (stages.length === 1) return; // Không cho xóa hết
    const newStages = [...stages];
    newStages.splice(stageIdx, 1);
    setStages(newStages);
  };

  // Khi nhấn nút "Xác nhận" sẽ mở modal xác nhận
  const handleConfirm = () => {
    setModalOpen(true);
  };

  // Khi đồng ý xác nhận: gửi dữ liệu từng dòng lên server, khóa chỉnh sửa
  const handleModalOk = async () => {
    setConfirmed(true);
    setModalOpen(false);

    try {
      // Gửi từng dòng tuần của từng giai đoạn lên server
      for (let i = 0; i < stages.length; i++) {
        for (let j = 0; j < stages[i].weeks.length; j++) {
          await api.post(
            `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`,
            {
              stageNumber: i + 1, // Số thứ tự giai đoạn
              week_range: stages[i].weeks[j].week, // Chuỗi tuần
              targetcigarettes: Number(stages[i].weeks[j].cigarettes), // Số điếu/ngày
              quitPlanId: quitPlanId,
            }
          );
        }
      }
      Modal.success({ content: "Tạo kế hoạch thành công!" });
    } catch (err) {
      Modal.error({ content: "Có lỗi khi lưu kế hoạch!" });
      setConfirmed(false);
    }
  };

  // Hủy xác nhận (đóng modal)
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", marginBottom: 24 }}>
        <img
          src={create1}
          alt="Banner tự lập kế hoạch"
          className="banner-create1"
          style={{ width: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Bảng Tự Lập Kế Hoạch
        </h2>
        {/* Hiển thị từng giai đoạn */}
        {stages.map((stage, stageIdx) => (
          <div
            key={stageIdx}
            className="mb-8 border rounded-lg shadow bg-white p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-blue-700">
                Giai đoạn {stageIdx + 1}
              </span>
              <div className="flex gap-2">
                {/* Không cho xóa giai đoạn 1 */}
                {!confirmed && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleAddRow(stageIdx)}
                      className="bg-blue-600"
                    >
                      Thêm dòng tuần
                    </Button>
                    {stageIdx !== 0 && (
                      <Button
                        danger
                        onClick={() => handleDeleteStage(stageIdx)}
                      >
                        Xóa giai đoạn
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Bảng nhập tuần và số điếu/ngày */}
            <Table
              dataSource={stage.weeks.map((row, rowIdx) => ({
                key: rowIdx,
                week: (
                  <Input
                    disabled={confirmed}
                    value={row.week}
                    placeholder="Từ tuần ... đến tuần ..."
                    onChange={(e) =>
                      handleChange(stageIdx, rowIdx, "week", e.target.value)
                    }
                  />
                ),
                cigarettes: (
                  <Input
                    disabled={confirmed}
                    type="number"
                    min={0}
                    value={row.cigarettes}
                    placeholder="Số điếu/ngày"
                    onChange={(e) =>
                      handleChange(
                        stageIdx,
                        rowIdx,
                        "cigarettes",
                        e.target.value
                      )
                    }
                  />
                ),
                // Không cho xóa dòng đầu tiên của mỗi giai đoạn
                action:
                  !confirmed && rowIdx !== 0 ? (
                    <Button
                      danger
                      size="small"
                      onClick={() => handleDeleteRow(stageIdx, rowIdx)}
                    >
                      Xóa
                    </Button>
                  ) : null,
              }))}
              columns={[
                {
                  title: "Thời gian (Từ tuần - đến tuần)",
                  dataIndex: "week",
                  key: "week",
                  align: "center",
                },
                {
                  title: "Giới hạn số thuốc mỗi ngày",
                  dataIndex: "cigarettes",
                  key: "cigarettes",
                  align: "center",
                },
                {
                  title: "",
                  dataIndex: "action",
                  key: "action",
                  align: "center",
                  width: 80,
                },
              ]}
              pagination={false}
              bordered
            />
          </div>
        ))}
        {/* Nút thêm giai đoạn và xác nhận */}
        <div className="flex gap-4 justify-center mt-4">
          {!confirmed && (
            <Button
              type="default"
              className="bg-green-600 text-white font-semibold"
              onClick={handleAddStage}
            >
              Thêm giai đoạn
            </Button>
          )}
          <Button
            type="primary"
            className="bg-blue-700 text-white font-semibold"
            onClick={handleConfirm}
            disabled={confirmed}
          >
            Xác nhận
          </Button>
        </div>
        {/* Modal xác nhận */}
        <Modal
          title="Xác nhận kế hoạch"
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <p>Bạn chắc chắn muốn xác nhận và khóa chỉnh sửa kế hoạch này?</p>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default CreatePlanning;
