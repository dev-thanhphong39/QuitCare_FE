import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Table, message } from "antd";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./CreatePlanning.css";
import create1 from "../../assets/images/create1.png";

const initialStage = () => ({
  weeks: [{ week: "", cigarettes: "" }],
});

const LOCAL_KEY = "quitcare_planning_draft";

function CreatePlanning() {
  const [stages, setStages] = useState([initialStage()]);
  const [mode, setMode] = useState("create"); // create | view | edit
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountId = localStorage.getItem("accountId");
  const quitPlanId = localStorage.getItem("quitPlanId");

  // Load lại kế hoạch nếu đã có, nếu không thì lấy bản nháp localStorage
  useEffect(() => {
    async function fetchPlan() {
      if (!accountId || !quitPlanId) {
        const draft = localStorage.getItem(LOCAL_KEY);
        if (draft) setStages(JSON.parse(draft));
        return;
      }
      try {
        setLoading(true);
        const res = await api.get(
          `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
        );
        if (res.data && res.data.length > 0) {
          const stageMap = {};
          res.data.forEach((item) => {
            if (!stageMap[item.stageNumber]) stageMap[item.stageNumber] = [];
            stageMap[item.stageNumber].push({
              week: item.week_range,
              cigarettes: item.targetCigarettes.toString(),
              id: item.id,
            });
          });
          setStages(
            Object.keys(stageMap)
              .sort()
              .map((k) => ({ weeks: stageMap[k] }))
          );
          setMode("view");
          localStorage.removeItem(LOCAL_KEY);
        } else {
          const draft = localStorage.getItem(LOCAL_KEY);
          if (draft) setStages(JSON.parse(draft));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [accountId, quitPlanId]);

  // Lưu stages vào localStorage mỗi khi thay đổi (chỉ khi đang tạo hoặc sửa)
  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(stages));
    }
  }, [stages, mode]);

  // Thêm/xóa dòng/giai đoạn
  const handleAddRow = (stageIdx) => {
    if (mode === "view") return;
    const newStages = [...stages];
    newStages[stageIdx].weeks.push({ week: "", cigarettes: "" });
    setStages(newStages);
  };
  // const handleAddStage = () => {
  //   if (mode === "view") return;
  //   setStages([...stages, initialStage()]);
  // };
  const handleChange = (stageIdx, rowIdx, field, value) => {
    if (mode === "view") return;
    const newStages = [...stages];
    newStages[stageIdx].weeks[rowIdx][field] = value;
    setStages(newStages);
  };
  const handleDeleteRow = (stageIdx, rowIdx) => {
    if (mode === "view") return;
    const newStages = [...stages];
    if (newStages[stageIdx].weeks.length > 1) {
      newStages[stageIdx].weeks.splice(rowIdx, 1);
      setStages(newStages);
    }
  };
  // const handleDeleteStage = (stageIdx) => {
  //   if (mode === "view" || stages.length === 1) return;
  //   const newStages = [...stages];
  //   newStages.splice(stageIdx, 1);
  //   setStages(newStages);
  // };

  // Xác nhận lưu kế hoạch (tạo mới hoặc cập nhật)
  const handleConfirm = () => setModalOpen(true);

  const handleModalOk = async () => {
    setLoading(true);
    try {
      // Lấy danh sách stage cũ từ server để biết id
      const res = await api.get(
        `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
      );
      const oldStages = res.data || [];

      // Xóa stage cũ không còn trong kế hoạch mới
      for (const old of oldStages) {
        let stillExist = false;
        for (const stage of stages) {
          for (const week of stage.weeks) {
            if (week.id === old.id) stillExist = true;
          }
        }
        if (!stillExist) {
          await api.delete(
            `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${old.id}`
          );
        }
      }

      // Cập nhật hoặc tạo mới từng dòng
      for (let i = 0; i < stages.length; i++) {
        for (let j = 0; j < stages[i].weeks.length; j++) {
          const week = stages[i].weeks[j];
          const data = {
            week_range: week.week,
            targetCigarettes: Number(week.cigarettes),
          };
          if (week.id) {
            // PUT cập nhật
            await api.put(
              `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${week.id}`,
              data
            );
          } else {
            // POST tạo mới
            await api.post(
              `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`,
              {
                ...data,
                stageNumber: i + 1,
                quitPlanId: Number(quitPlanId),
              }
            );
          }
        }
      }

      // Sau khi lưu thành công, gọi lại API để lấy dữ liệu mới nhất và đồng bộ localStorage
      const reload = await api.get(
        `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
      );
      if (reload.data && reload.data.length > 0) {
        const stageMap = {};
        reload.data.forEach((item) => {
          if (!stageMap[item.stageNumber]) stageMap[item.stageNumber] = [];
          stageMap[item.stageNumber].push({
            week: item.week_range,
            cigarettes: item.targetCigarettes.toString(),
            id: item.id,
          });
        });
        setStages(
          Object.keys(stageMap)
            .sort()
            .map((k) => ({ weeks: stageMap[k] }))
        );
        setMode("view");
        // XÓA bản nháp khi đã có dữ liệu trên server
        localStorage.removeItem(LOCAL_KEY);
      }
      Modal.success({ content: "Lưu kế hoạch thành công!" });
    } catch (err) {
      Modal.error({ content: "Có lỗi khi lưu kế hoạch!" });
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  // Chuyển sang chế độ chỉnh sửa
  const handleEdit = () => setMode("edit");

  // Hủy chỉnh sửa, reload lại kế hoạch từ server
  const handleCancelEdit = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
      );
      if (res.data && res.data.length > 0) {
        const stageMap = {};
        res.data.forEach((item) => {
          if (!stageMap[item.stageNumber]) stageMap[item.stageNumber] = [];
          stageMap[item.stageNumber].push({
            week: item.week_range,
            cigarettes: item.targetCigarettes.toString(),
            id: item.id,
          });
        });
        setStages(
          Object.keys(stageMap)
            .sort()
            .map((k) => ({ weeks: stageMap[k] }))
        );
      }
      setMode("view");
    } finally {
      setLoading(false);
    }
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
          {mode === "view"
            ? "Kế Hoạch Cai Thuốc Của Bạn"
            : "Bảng Tự Lập Kế Hoạch"}
        </h2>
        {loading && <div className="text-center py-8">Đang tải...</div>}
        {!loading &&
          stages.slice(0, 1).map((stage, stageIdx) => (
            <div
              key={stageIdx}
              className="mb-8 border rounded-lg shadow bg-white p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-blue-700">
                  Giai đoạn
                </span>
                <div className="flex gap-2">
                  {mode !== "view" && (
                    <Button
                      type="primary"
                      onClick={() => handleAddRow(stageIdx)}
                      className="bg-blue-600"
                      size="small"
                    >
                      Thêm giai đoạn
                    </Button>
                  )}
                </div>
              </div>
              <Table
                dataSource={stage.weeks.map((row, rowIdx) => ({
                  key: rowIdx,
                  week:
                    mode === "view" ? (
                      <div className="text-center font-medium">{row.week}</div>
                    ) : (
                      <Input
                        disabled={mode === "view"}
                        value={row.week}
                        placeholder="Từ tuần ... đến tuần ..."
                        onChange={(e) =>
                          handleChange(stageIdx, rowIdx, "week", e.target.value)
                        }
                      />
                    ),
                  cigarettes:
                    mode === "view" ? (
                      <div className="text-center font-medium text-green-600">
                        {row.cigarettes} điếu/ngày
                      </div>
                    ) : (
                      <Input
                        disabled={mode === "view"}
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
                  action:
                    mode !== "view" && rowIdx !== 0 ? (
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
                  ...(mode !== "view"
                    ? [
                        {
                          title: "",
                          dataIndex: "action",
                          key: "action",
                          align: "center",
                          width: 80,
                        },
                      ]
                    : []),
                ]}
                pagination={false}
                bordered
              />
            </div>
          ))}
        {/* Nút điều khiển */}
        <div className="flex gap-4 justify-center mt-4">
          {mode === "create" && (
            <>
              {/* <Button
                type="default"
                className="bg-green-600 text-white font-semibold"
                onClick={handleAddStage}
              >
                Thêm giai đoạn
              </Button> */}
              <Button
                type="primary"
                className="bg-green-600 text-white font-semibold"
                onClick={handleConfirm}
              >
                Lưu kế hoạch
              </Button>
            </>
          )}
          {mode === "view" && (
            <Button
              type="primary"
              className="bg-orange-500"
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          )}
          {mode === "edit" && (
            <>
              <Button onClick={handleCancelEdit}>Hủy</Button>
              <Button
                type="primary"
                className="bg-green-600"
                onClick={handleConfirm}
              >
                Lưu thay đổi
              </Button>
            </>
          )}
        </div>
        {/* Modal xác nhận */}
        <Modal
          title={
            mode === "edit" ? "Xác nhận cập nhật kế hoạch" : "Xác nhận kế hoạch"
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={
            <div className="modal-btn-group">
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                className="bg-blue-600"
                loading={loading}
                onClick={handleModalOk}
              >
                Đồng ý
              </Button>
            </div>
          }
        >
          <p>
            {mode === "edit"
              ? "Bạn chắc chắn muốn lưu những thay đổi này?"
              : "Bạn chắc chắn muốn xác nhận và lưu kế hoạch này?"}
          </p>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default CreatePlanning;
