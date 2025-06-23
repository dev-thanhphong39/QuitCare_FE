import React, { useState } from "react";
import { Button, Modal, Input, Table } from "antd";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./CreatePlanning.css";

const initialStage = () => ({
  weeks: [{ week: "", cigarettes: "" }],
});

function CreatePlanning() {
  const [stages, setStages] = useState([initialStage()]);
  const [confirmed, setConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const accountId = localStorage.getItem("accountId");
  const quitPlanId = localStorage.getItem("quitPlanId");

  // Thêm hàng tuần mới vào 1 giai đoạn
  const handleAddRow = (stageIdx) => {
    if (confirmed) return;
    const newStages = [...stages];
    newStages[stageIdx].weeks.push({ week: "", cigarettes: "" });
    setStages(newStages);
  };

  // Thêm giai đoạn mới
  const handleAddStage = () => {
    if (confirmed) return;
    setStages([...stages, initialStage()]);
  };

  // Xử lý thay đổi input
  const handleChange = (stageIdx, rowIdx, field, value) => {
    if (confirmed) return;
    const newStages = [...stages];
    newStages[stageIdx].weeks[rowIdx][field] = value;
    setStages(newStages);
  };

  // Chỉ mở modal xác nhận, không gửi dữ liệu ở đây
  const handleConfirm = () => {
    setModalOpen(true);
  };

  // Đồng ý xác nhận: gửi dữ liệu lên server
  const handleModalOk = async () => {
    setConfirmed(true);
    setModalOpen(false);

    try {
      for (let i = 0; i < stages.length; i++) {
        for (let j = 0; j < stages[i].weeks.length; j++) {
          await api.post(
            `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`,
            {
              stageNumber: i + 1,
              week_range: stages[i].weeks[j].week,
              targetcigarettes: Number(stages[i].weeks[j].cigarettes),
              quitPlanId: quitPlanId,
            }
          );
        }
      }
      alert("Tạo kế hoạch thành công!");
    } catch (err) {
      alert("Có lỗi khi lưu kế hoạch!");
      setConfirmed(false);
    }
  };

  // Hủy xác nhận
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleDeleteStage = async (stageIdx) => {
    // Nếu đã xác nhận thì không cho xóa
    if (confirmed) return;

    // Nếu giai đoạn đã có id (đã lưu lên server), gọi API xóa
    const stage = stages[stageIdx];
    // Giả sử mỗi tuần trong giai đoạn đều có cùng stageId (id backend trả về)
    // Nếu bạn lưu id cho từng tuần, hãy lấy id từ tuần đầu tiên
    const stageId = stage.weeks[0]?.id;
    if (stageId) {
      try {
        await api.delete(
          `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${stageId}`
        );
      } catch (err) {
        alert("Xóa giai đoạn thất bại!");
        return;
      }
    }

    // Xóa giai đoạn khỏi state
    const newStages = [...stages];
    newStages.splice(stageIdx, 1);
    setStages(newStages);
  };

  const handleUpdateStage = async (stageIdx) => {
    const stage = stages[stageIdx];
    const stageId = stage.weeks[0]?.id;
    if (!stageId) {
      alert("Không tìm thấy ID giai đoạn để cập nhật!");
      return;
    }
    try {
      // Ví dụ: chỉ cập nhật tuần đầu tiên của giai đoạn, bạn có thể lặp nếu muốn cập nhật nhiều tuần
      await api.put(
        `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${stageId}`,
        {
          week_range: stage.weeks[0].week,
          targetcigarettes: Number(stage.weeks[0].cigarettes),
        }
      );
      alert("Cập nhật giai đoạn thành công!");
    } catch (err) {
      alert("Cập nhật giai đoạn thất bại!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Bảng Tự Lập Kế Hoạch
        </h2>
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
                {!confirmed && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleAddRow(stageIdx)}
                      className="bg-blue-600"
                    >
                      Thêm
                    </Button>
                    <Button danger onClick={() => handleDeleteStage(stageIdx)}>
                      Xóa giai đoạn
                    </Button>
                  </>
                )}
                {confirmed && stage.weeks[0]?.id && (
                  <Button
                    type="default"
                    onClick={() => handleUpdateStage(stageIdx)}
                  >
                    Cập nhật giai đoạn
                  </Button>
                )}
              </div>
            </div>
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
              ]}
              pagination={false}
              bordered
            />
            <div className="flex gap-2 mt-4">
              {!confirmed && (
                <Button
                  type="default"
                  onClick={() => handleUpdateStage(stageIdx)}
                  disabled={!confirmed || !stage.weeks[0]?.id}
                >
                  Cập nhật giai đoạn
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 justify-center mt-4">
          {!confirmed && (
            <Button
              type="default"
              className="bg-green-600 text-white font-semibold"
              onClick={handleAddStage}
            >
              Tạo giai đoạn
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
