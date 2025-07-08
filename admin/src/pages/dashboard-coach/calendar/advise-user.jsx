import React, { useState, useEffect } from "react";
import axios from "axios";
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
import api from "../../../configs/axios";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;

const AdviseUser = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/booking/coach", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.map((item, index) => {
        const start = moment(`${item.appointmentDate} ${item.startTime}`);
        return {
          id: index,
          memberName: item.customerName,
          startTime: start,
          endTime: start.clone().add(60, "minutes"), // Giả định 30 phút
          status: item.status.toLowerCase(),
          meetLink: item.googleMeetLink,
          memberAvatar: null,
          notes: "",
        };
      });

      setAppointments(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "orange";
      case "in_progress": return "blue";
      case "completed": return "green";
      case "cancelled": return "red";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Chờ tư vấn";
      case "in_progress": return "Đang tư vấn";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const handleStartConsultation = (record) => {
    Modal.confirm({
      title: "Bắt đầu tư vấn",
      icon: <VideoCameraOutlined style={{ color: "#1890ff" }} />,
      content: (
        <p>Bạn có muốn bắt đầu buổi tư vấn với <strong>{record.memberName}</strong>?</p>
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
        <p>Bạn có muốn đánh dấu buổi tư vấn với <strong>{record.memberName}</strong> là hoàn thành?</p>
      ),
      okText: "Hoàn thành",
      cancelText: "Hủy",
      onOk: () => {
        updateAppointmentStatus(record.id, "completed");
        message.success("Đã đánh dấu hoàn thành");
      },
    });
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && appointment.status === "pending") ||
      // (activeTab === "in_progress" && appointment.status === "in_progress") ||
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
          <Avatar src={record.memberAvatar} icon={<UserOutlined />} size={50} />
          <div className="member-details">
            <div className="member-name">{text}</div>
            <div className="member-contact">
              <MailOutlined className="contact-icon" /> <span>{record.memberEmail}</span>
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
        <div>
          <div><CalendarOutlined /> {moment(record.startTime).format("DD/MM/YYYY")}</div>
          <div><ClockCircleOutlined /> {moment(record.startTime).format("HH:mm")} - {moment(record.endTime).format("HH:mm")}</div>
          <div>Thời lượng: {moment(record.endTime).diff(moment(record.startTime), "minutes")} phút</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Link tư vấn",
      dataIndex: "meetLink",
      key: "meetLink",
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <LinkOutlined /> Mở liên kết
        </a>
      ),
    },
    // {
    //   title: "Ghi chú",
    //   dataIndex: "notes",
    //   key: "notes",
    //   width: 250,
    //   render: (notes) => (
    //     <Tooltip title={notes}><Text ellipsis>{notes}</Text></Tooltip>
    //   ),
    // },
    {
      title: "Hành động",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div>
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<VideoCameraOutlined />}
              onClick={() => handleStartConsultation(record)}
            >
              Bắt đầu
            </Button>
          )}

          {record.status === "in_progress" && (
            <Space direction="vertical">
              <Button
                type="default"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(record.meetLink, "_blank")}
              >
                Vào phòng
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleCompleteConsultation(record)}
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
        <div className="page-header">
          <div className="header-content">
            <div className="header-info">
              <Title level={2}>Quản lý lịch tư vấn</Title>
              <Text>Theo dõi và quản lý các buổi tư vấn với thành viên</Text>
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

        <div className="statistics-section">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}><Card><Statistic title="Chờ tư vấn" value={getTabCount("pending")} valueStyle={{ color: "#fa8c16" }} prefix={<ClockCircleOutlined />} /></Card></Col>
            {/* <Col xs={12} sm={6}><Card><Statistic title="Đang tư vấn" value={getTabCount("in_progress")} valueStyle={{ color: "#1890ff" }} prefix={<VideoCameraOutlined />} /></Card></Col> */}
            <Col xs={12} sm={6}><Card><Statistic title="Hoàn thành" value={getTabCount("completed")} valueStyle={{ color: "#52c41a" }} prefix={<CheckCircleOutlined />} /></Card></Col>
            <Col xs={12} sm={6}><Card><Statistic title="Tổng số" value={getTabCount("all")} valueStyle={{ color: "#722ed1" }} prefix={<TeamOutlined />} /></Card></Col>
          </Row>
        </div>

        <Card className="main-content-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane tab={<Badge count={getTabCount("pending")}><span><ClockCircleOutlined /> Chờ tư vấn</span></Badge>} key="pending" />
            {/* <TabPane tab={<Badge count={getTabCount("in_progress")}><span><VideoCameraOutlined /> Đang tư vấn</span></Badge>} key="in_progress" /> */}
            <TabPane tab={<Badge count={getTabCount("completed")}><span><CheckCircleOutlined /> Hoàn thành</span></Badge>} key="completed" />
            <TabPane tab={<Badge count={getTabCount("all")}><span><TeamOutlined /> Tất cả</span></Badge>} key="all" />
          </Tabs>

          {filteredAppointments.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có lịch hẹn nào phù hợp" />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdviseUser;