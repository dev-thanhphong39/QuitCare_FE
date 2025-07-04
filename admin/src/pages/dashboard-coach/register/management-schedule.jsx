import React, { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Button,
  message,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  DatePicker,
  Divider,
  Alert,
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

// Giờ hành chính cố định
const WORKING_HOURS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const WorkScheduleManagement = () => {
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateMonthSchedule();
  }, [currentMonth]);

  const generateMonthSchedule = () => {
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    const monthData = Array.from({ length: daysInMonth }, (_, i) => {
      const date = startOfMonth.add(i, "day");
      return {
        key: date.format("YYYY-MM-DD"),
        date,
        dateStr: date.format("YYYY-MM-DD"),
        dayName: date.format("dddd"),
        isLeave: false,
      };
    });

    setData(monthData);
  };

  const handleLeaveChange = (dateStr, checked) => {
    setData((prev) =>
      prev.map((item) =>
        item.dateStr === dateStr ? { ...item, isLeave: checked } : item
      )
    );
  };

  const handleSubmitAll = async () => {
    setLoading(true);
    try {
      for (const record of data) {
        await api.post("/session/register", {
          accountId,
          date: record.dateStr,
          isLeave: record.isLeave,
          workingSlots: record.isLeave ? [] : WORKING_HOURS,
        });
      }
      message.success(
        `✅ Đã lưu lịch tháng ${currentMonth.format("MM/YYYY")} thành công!`
      );
    } catch (error) {
      message.error("❌ Có lỗi xảy ra khi lưu lịch.");
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <CalendarOutlined className="page-icon" />
              <div>
                <Title level={2} className="page-title">
                  Đăng ký lịch nghỉ
                </Title>
                <Text className="page-subtitle">
                  Chọn những ngày bạn muốn nghỉ - Lịch làm mặc định: 8:00-17:00
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

        {/* Month Navigation */}
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

        {/* Stats */}
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

        {/* Working Schedule Info */}
        <Alert
          message="Lịch làm việc cố định"
          description="Sáng: 8:00-12:00 (4 tiếng) • Chiều: 13:00-17:00 (4 tiếng) • Tổng: 8 tiếng/ngày"
          type="info"
          showIcon
          className="schedule-info"
        />

        {/* Calendar Grid */}
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
                        8h
                      </Tag>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Save Button */}
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
