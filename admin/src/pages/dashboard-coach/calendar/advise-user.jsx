import React, { useState, useEffect } from "react";
import {
  Table,
  Tabs,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Tooltip,
  Card,
  Badge,
  Avatar,
  Typography,
  Input,
  Row,
  Col,
  Statistic,
  Empty,
} from "antd";
import {
  VideoCameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  CalendarOutlined,
  LinkOutlined,
  ReloadOutlined,
  MailOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./advise-user.css";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;

const AdviseUser = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchText, setSearchText] = useState("");

  // Mock data - thay thế bằng API call thực tế
  const mockAppointments = [
    {
      id: 1,
      memberName: "Nguyễn Văn A",
      memberAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      startTime: "2025-01-15 14:00",
      endTime: "2025-01-15 15:00",
      status: "pending",
      meetLink: "https://meet.google.com/abc-defg-hij",
      notes: "Tư vấn lần đầu về kế hoạch cai thuốc",
      memberEmail: "nguyenvana@email.com",
    },
    {
      id: 2,
      memberName: "Trần Thị B",
      memberAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      startTime: "2025-01-15 16:00",
      endTime: "2025-01-15 17:00",
      status: "in_progress",
      meetLink: "https://zoom.us/j/123456789",
      notes: "Tư vấn theo dõi tiến độ cai thuốc",
      memberEmail: "tranthib@email.com",
    },
    {
      id: 3,
      memberName: "Lê Văn C",
      memberAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      startTime: "2025-01-14 10:00",
      endTime: "2025-01-14 11:00",
      status: "completed",
      meetLink: "https://meet.google.com/xyz-uvwx-rst",
      notes: "Tư vấn hoàn thành, đánh giá kết quả",
      memberEmail: "levanc@email.com",
    },
    {
      id: 4,
      memberName: "Phạm Thị D",
      memberAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      startTime: "2025-01-16 09:00",
      endTime: "2025-01-16 10:00",
      status: "pending",
      meetLink: "https://meet.google.com/def-ghi-jkl",
      notes: "Tư vấn đánh giá tiến độ sau 2 tuần",
      memberEmail: "phamthid@email.com",
    },
  ];

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setAppointments(mockAppointments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("Không thể tải danh sách lịch hẹn");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "in_progress":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ tư vấn";
      case "in_progress":
        return "Đang tư vấn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleStartConsultation = (record) => {
    Modal.confirm({
      title: "Bắt đầu tư vấn",
      icon: <VideoCameraOutlined style={{ color: "#1890ff" }} />,
      content: (
        <div>
          <p>
            Bạn có muốn bắt đầu buổi tư vấn với{" "}
            <strong>{record.memberName}</strong>?
          </p>
        </div>
      ),
      okText: "Bắt đầu",
      cancelText: "Hủy",
      onOk: () => {
        updateAppointmentStatus(record.id, "in_progress");
        window.open(record.meetLink, "_blank");
        message.success("Đã bắt đầu buổi tư vấn");
      },
    });
  };

  const handleCompleteConsultation = (record) => {
    Modal.confirm({
      title: "Hoàn thành tư vấn",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      content: (
        <div>
          <p>
            Bạn có muốn đánh dấu buổi tư vấn với{" "}
            <strong>{record.memberName}</strong> là hoàn thành?
          </p>
        </div>
      ),
      okText: "Hoàn thành",
      cancelText: "Hủy",
      onOk: () => {
        updateAppointmentStatus(record.id, "completed");
        message.success("Đã đánh dấu hoàn thành");
      },
    });
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && appointment.status === "pending") ||
      (activeTab === "in_progress" && appointment.status === "in_progress") ||
      (activeTab === "completed" && appointment.status === "completed");

    const matchesSearch = appointment.memberName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const columns = [
    {
      title: "Thành viên",
      dataIndex: "memberName",
      key: "memberName",
      width: 280,
      render: (text, record) => (
        <div className="member-info">
          <Avatar
            src={record.memberAvatar}
            icon={<UserOutlined />}
            size={50}
            className="member-avatar"
          />
          <div className="member-details">
            <div className="member-name">{text}</div>
            <div className="member-contact">
              <div className="contact-item">
                <MailOutlined className="contact-icon" />
                <span>{record.memberEmail}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 200,
      render: (_, record) => (
        <div className="time-info">
          <div className="time-item">
            <CalendarOutlined className="time-icon" />
            <span className="time-text">
              {moment(record.startTime).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="time-item">
            <ClockCircleOutlined className="time-icon" />
            <span className="time-text">
              {moment(record.startTime).format("HH:mm")} -{" "}
              {moment(record.endTime).format("HH:mm")}
            </span>
          </div>
          <div className="duration">
            Thời lượng:{" "}
            {moment(record.endTime).diff(moment(record.startTime), "minutes")}{" "}
            phút
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="status-tag">
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      width: 250,
      render: (notes) => (
        <div className="notes-container">
          <FileTextOutlined className="notes-icon" />
          <Tooltip title={notes}>
            <Text ellipsis className="notes-text">
              {notes}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="actions-container">
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<VideoCameraOutlined />}
              onClick={() => handleStartConsultation(record)}
              className="action-btn"
            >
              Bắt đầu
            </Button>
          )}

          {record.status === "in_progress" && (
            <Space size="small" direction="vertical" className="w-full">
              <Button
                type="default"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(record.meetLink, "_blank")}
                className="action-btn"
                block
              >
                Vào phòng
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleCompleteConsultation(record)}
                className="action-btn"
                block
              >
                Hoàn thành
              </Button>
            </Space>
          )}

          {record.status === "completed" && (
            <Button
              type="default"
              size="small"
              icon={<CheckCircleOutlined />}
              disabled
              className="action-btn"
            >
              Đã hoàn thành
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getTabCount = (status) => {
    return appointments.filter(
      (apt) => status === "all" || apt.status === status
    ).length;
  };

  return (
    <div className="advise-user-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-info">
              <Title level={2} className="page-title">
                Quản lý lịch tư vấn
              </Title>
              <Text className="page-subtitle">
                Theo dõi và quản lý các buổi tư vấn với thành viên
              </Text>
            </div>
            <div className="header-actions">
              <Search
                placeholder="Tìm kiếm thành viên..."
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                style={{ width: 320 }}
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchAppointments}
                loading={loading}
                size="large"
              >
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="statistics-section">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Chờ tư vấn"
                  value={getTabCount("pending")}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Đang tư vấn"
                  value={getTabCount("in_progress")}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<VideoCameraOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Hoàn thành"
                  value={getTabCount("completed")}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Tổng số"
                  value={getTabCount("all")}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Main Content */}
        <Card className="main-content-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={
                <Badge count={getTabCount("pending")} offset={[10, -5]}>
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Chờ tư vấn
                  </span>
                </Badge>
              }
              key="pending"
            />
            <TabPane
              tab={
                <Badge count={getTabCount("in_progress")} offset={[10, -5]}>
                  <span>
                    <VideoCameraOutlined style={{ marginRight: 8 }} />
                    Đang tư vấn
                  </span>
                </Badge>
              }
              key="in_progress"
            />
            <TabPane
              tab={
                <Badge count={getTabCount("completed")} offset={[10, -5]}>
                  <span>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    Hoàn thành
                  </span>
                </Badge>
              }
              key="completed"
            />
            <TabPane
              tab={
                <Badge count={getTabCount("all")} offset={[10, -5]}>
                  <span>
                    <TeamOutlined style={{ marginRight: 8 }} />
                    Tất cả
                  </span>
                </Badge>
              }
              key="all"
            />
          </Tabs>

          {filteredAppointments.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có lịch hẹn nào phù hợp"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey="id"
              loading={loading}
              pagination={{
                total: filteredAppointments.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch hẹn`,
              }}
              scroll={{ x: 1200 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdviseUser;
