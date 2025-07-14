import React, { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Button,
  message,
  Tag,
  Typography,
  Row,
  Col,
  DatePicker,
  Alert,
  Modal,
} from "antd";
import {
  CalendarOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";
import "./management-schedule.css";

const { Title, Text } = Typography;

const WorkScheduleManagement = () => {
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverWorkingDays, setServerWorkingDays] = useState([]);

  useEffect(() => {
    generateMonthSchedule();
  }, [currentMonth]);

  const generateMonthSchedule = async () => {
    const startOfMonth = currentMonth.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = currentMonth.endOf("month").format("YYYY-MM-DD");

    

    try {
      const res = await api.get("/session/working-days", {
        params: {
          from: startOfMonth,
          to: endOfMonth,
        },
      });

      const workingDays = (res.data || []).filter(item => item.available !== false);
      const workingDateStrings = Array.from(
        new Set(workingDays.map(item => item.date))
      );
      setServerWorkingDays(workingDateStrings);
      console.log("🌐 Working days từ server:", workingDateStrings);
      const daysInMonth = currentMonth.daysInMonth();
      const startDate = dayjs(startOfMonth);

      const monthData = Array.from({ length: daysInMonth }, (_, i) => {
        const date = startDate.add(i, "day");
        const dateStr = date.format("YYYY-MM-DD");

        return {
          key: dateStr,
          date,
          dateStr,
          dayName: date.format("dddd"),
          isLeave : !workingDateStrings.includes(dateStr), // ✅ Ngày không có trong workingDayStrings ⇒ nghỉ
        };
      });

      setData(monthData);
      // //  In log toàn bộ danh sách ngày trong tháng
      // console.log(" Danh sách ngày trong tháng:", monthData);
      // monthData.forEach((item) => {
      //   console.log(
      //     `${item.dateStr} - ${item.dayName} - ${
      //       item.isLeave ? " Nghỉ" : " Làm"
      //     }`
      //   );
      // });
    } catch (err) {
      console.error(" Error fetching working days:", err);
      message.error("Lỗi khi tải dữ liệu lịch làm việc!");
    }
  };

  const handleLeaveChange = (dateStr, checked) => {
    setData((prev) =>
      prev.map((item) =>
        item.dateStr === dateStr
          ? {
              ...item,
              isLeave: checked,
              isNewLeave: checked && !item.isLeave && !item.isNewLeave, // đánh dấu chỉ khi chuyển từ làm → nghỉ
            }
          : item
      )
    );
  };
  const handleSubmitAll = () => {
    console.log("==> Bắt đầu xử lý xác nhận");

    Modal.confirm({
      title: "Xác nhận cập nhật ngày nghỉ",
      content: `Bạn có chắc chắn muốn cập nhật danh sách ngày nghỉ đã chọn cho tháng ${currentMonth.format("MM/YYYY")} không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const leaveRecords = data.filter(
            (record) => record.isLeave && serverWorkingDays.includes(record.dateStr)
          );
  
          console.log("leaveRecords:", leaveRecords);
  
          for (const record of leaveRecords) {
            console.log(" Gửi xoá ngày:", {
              accountId,
              date: record.dateStr,
            });
  
            const res = await api.put("/session/availability-day", {
              accountId,
              date: record.dateStr,
            });
  
            console.log(" Xoá thành công:", res.data);
          }
  
          message.success(
            `Đã cập nhật ngày nghỉ cho tháng ${currentMonth.format("MM/YYYY")} thành công!`
          );
  
          await generateMonthSchedule();
        } catch (error) {
          message.error("Có lỗi xảy ra khi cập nhật ngày nghỉ.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getDateStatus = (record) => {
    const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
    const isToday = dayjs(record.dateStr).isSame(dayjs(), "day");
    const isWeekend = record.date.day() === 0 || record.date.day() === 6;

    if (isPast) return { status: "past", color: "#d9d9d9" };
    if (isToday) return { status: "today", color: "#1890ff" };
    if (isWeekend) return { status: "weekend", color: "#722ed1" };
    if (record.isLeave) return { status: "leave", color: "#ff4d4f" };
    return { status: "working", color: "#52c41a" };
  };

  const workingDays = data.filter((item) => !item.isLeave).length;
  const leaveDays = data.filter((item) => item.isLeave).length;

  return (
    <div className="schedule-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <CalendarOutlined className="page-icon" />
              <div>
                <Title level={2} className="page-title">
                  Đăng ký lịch nghỉ
                </Title>
                <Text className="page-subtitle">
                  Mặc định là làm việc. Tick vào để đăng ký nghỉ từng ngày.
                </Text>
              </div>
            </div>

            <div className="header-actions">
              <DatePicker
                picker="month"
                value={currentMonth}
                onChange={(date) => setCurrentMonth(date || dayjs())}
                format="MM/YYYY"
                size="large"
                className="month-picker"
              />
            </div>
          </div>
        </div>

        <div className="month-nav">
          <Button
            icon={<LeftOutlined />}
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            size="large"
            className="nav-btn"
          >
            Tháng trước
          </Button>

          <div className="current-month">
            <Text strong className="month-text">
              Tháng {currentMonth.format("MM/YYYY")}
            </Text>
          </div>

          <Button
            icon={<RightOutlined />}
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            size="large"
            className="nav-btn"
          >
            Tháng sau
          </Button>
        </div>

        <Row gutter={24} className="stats-row">
          <Col span={8}>
            <div className="stat-card working">
              <div className="stat-icon">
                <CheckCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{workingDays}</div>
                <div className="stat-label">Ngày làm việc</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card leave">
              <div className="stat-icon">
                <CloseCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{leaveDays}</div>
                <div className="stat-label">Ngày nghỉ</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card total">
              <div className="stat-icon">
                <ClockCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{workingDays * 8}</div>
                <div className="stat-label">Tổng giờ làm</div>
              </div>
            </div>
          </Col>
        </Row>

        <Alert
          message="Lịch làm việc cố định"
          description="Mặc định: 07:00-17:00 giờ . Tick vào ngày bạn muốn nghỉ."
          type="info"
          showIcon
          className="schedule-info"
        />

        <Card className="calendar-card">
          <div className="calendar-header">
            <Title level={4}>Chọn ngày nghỉ</Title>
            <Text type="secondary">Click vào ô checkbox để chọn ngày nghỉ</Text>
          </div>

          <div className="calendar-grid">
            {data.map((record) => {
              const dateStatus = getDateStatus(record);
              const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");

              return (
                <div
                  key={record.dateStr}
                  className={`day-cell ${dateStatus.status} ${
                    isPast ? "disabled" : ""
                  }`}
                  style={{ borderColor: dateStatus.color }}
                >
                  <div className="day-header">
                    <span className="day-number">
                      {record.date.format("DD")}
                    </span>
                    <span className="day-name">
                      {record.date.format("ddd")}
                    </span>
                  </div>

                  <div className="day-content">
                    {!isPast && (
                      <Checkbox
                        checked={record.isLeave}
                        onChange={(e) =>
                          handleLeaveChange(record.dateStr, e.target.checked)
                        }
                        className="leave-checkbox"
                      >
                        Nghỉ
                      </Checkbox>
                    )}

                    {isPast && (
                      <Tag size="small" color="default">
                        Đã qua
                      </Tag>
                    )}
                  </div>

                  <div className="day-status">
                    {record.isLeave ? (
                      <Tag color="red" size="small">
                        Nghỉ
                      </Tag>
                    ) : (
                      <Tag color="green" size="small">
                        Làm
                      </Tag>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="save-section">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSubmitAll}
            loading={loading}
            className="save-btn"
          >
            Lưu lịch tháng {currentMonth.format("MM/YYYY")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleManagement;
