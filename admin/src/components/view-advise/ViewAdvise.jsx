import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Select,
  Input,
  Modal,
  Avatar,
  Divider,
  Badge,
  Empty,
  message,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./ViewAdvise.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

function ViewAdvise() {
  const user = useSelector((state) => state.user);

  // States
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchConsultations();

    // Auto refresh every 30 seconds to check for updates
    const interval = setInterval(fetchConsultations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/consultations/user/${user.id}`);
      // setConsultations(response.data);

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          coachName: "Bác sĩ Nguyễn Văn A",
          coachAvatar: null,
          date: "2025-07-05",
          time: "10:00",
          endTime: "11:00",
          meetingLink: "https://meet.google.com/abc-def-ghi",
          status: "PENDING",
          notes:
            "Tư vấn về kế hoạch cai thuốc lá, đánh giá tình trạng hiện tại",
          duration: 60,
          type: "VIDEO_CALL",
          createdAt: "2025-07-04T08:30:00",
          platform: "Google Meet",
        },
        {
          id: 2,
          coachName: "Bác sĩ Trần Thị B",
          coachAvatar: null,
          date: "2025-07-04",
          time: "15:00",
          endTime: "16:00",
          meetingLink: "https://zoom.us/j/123456789",
          status: "COMPLETED",
          notes:
            "Đánh giá tiến trình cai thuốc tuần 1, tư vấn về phương pháp thay thế",
          duration: 60,
          type: "VIDEO_CALL",
          createdAt: "2025-07-03T09:15:00",
          platform: "Zoom",
          completedAt: "2025-07-04T16:05:00",
        },
        {
          id: 3,
          coachName: "Bác sĩ Lê Văn C",
          coachAvatar: null,
          date: "2025-07-03",
          time: "09:30",
          endTime: "10:30",
          meetingLink: "https://meet.google.com/xyz-abc-def",
          status: "CANCELLED",
          notes: "Hủy do lịch trình thay đổi của bệnh nhân",
          duration: 60,
          type: "VIDEO_CALL",
          createdAt: "2025-07-02T14:20:00",
          platform: "Google Meet",
          cancelledAt: "2025-07-03T08:00:00",
        },
        {
          id: 4,
          coachName: "Bác sĩ Phạm Thị D",
          coachAvatar: null,
          date: "2025-07-06",
          time: "14:00",
          endTime: "15:00",
          meetingLink: "https://zoom.us/j/987654321",
          status: "IN_PROGRESS",
          notes: "Buổi tư vấn theo dõi tuần 2",
          duration: 60,
          type: "VIDEO_CALL",
          createdAt: "2025-07-05T10:45:00",
          platform: "Zoom",
        },
      ];

      setConsultations(mockData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tư vấn:", error);
      message.error("Không thể tải danh sách tư vấn");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "orange",
        text: "Chờ tư vấn",
        icon: <ClockCircleOutlined />,
        bgColor: "#fff7e6",
        borderColor: "#ffc069",
      },
      COMPLETED: {
        color: "green",
        text: "Đã hoàn thành",
        icon: <CheckCircleOutlined />,
        bgColor: "#f6ffed",
        borderColor: "#b7eb8f",
      },
      CANCELLED: {
        color: "red",
        text: "Đã hủy",
        icon: <ExclamationCircleOutlined />,
        bgColor: "#fff2f0",
        borderColor: "#ffccc7",
      },
      IN_PROGRESS: {
        color: "blue",
        text: "Đang diễn ra",
        icon: <PlayCircleOutlined />,
        bgColor: "#e6f7ff",
        borderColor: "#91d5ff",
      },
    };
    return (
      configs[status] || {
        color: "default",
        text: "Không xác định",
        icon: null,
        bgColor: "#fafafa",
        borderColor: "#d9d9d9",
      }
    );
  };

  const joinMeeting = (consultation) => {
    if (consultation.meetingLink) {
      window.open(consultation.meetingLink, "_blank");

      // Auto mark as completed after joining (simulate)
      setTimeout(() => {
        setConsultations((prev) =>
          prev.map((item) =>
            item.id === consultation.id
              ? {
                  ...item,
                  status: "COMPLETED",
                  completedAt: new Date().toISOString(),
                }
              : item
          )
        );
        message.success("Buổi tư vấn đã được đánh dấu hoàn thành!");
      }, 5000); // Simulate 5 seconds delay
    }
  };

  const filteredConsultations = consultations.filter((item) => {
    const statusMatch = statusFilter === "ALL" || item.status === statusFilter;
    const searchMatch =
      item.coachName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchText.toLowerCase());

    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (name, record) => (
        <div className="coach-info">
          <Avatar
            size={40}
            src={record.coachAvatar}
            icon={<UserOutlined />}
            className="coach-avatar"
          />
          <div className="coach-details">
            <Text strong className="coach-name">
              {name}
            </Text>
            <Text type="secondary" className="coach-platform">
              {record.platform}
            </Text>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Ngày giờ",
      key: "datetime",
      render: (_, record) => (
        <div className="datetime-info">
          <div className="date-text">
            <CalendarOutlined className="date-icon" />
            {dayjs(record.date).format("DD/MM/YYYY")}
          </div>
          <div className="time-text">
            {record.time} - {record.endTime}
          </div>
          <Text type="secondary" className="duration-text">
            (60 phút)
          </Text>
        </div>
      ),
      width: 150,
      sorter: (a, b) =>
        dayjs(a.date + " " + a.time).unix() -
        dayjs(b.date + " " + b.time).unix(),
    },
    {
      title: "Link tư vấn",
      dataIndex: "meetingLink",
      key: "meetingLink",
      render: (link, record) => (
        <div className="meeting-link-cell">
          {record.status === "PENDING" || record.status === "IN_PROGRESS" ? (
            <Button
              type="primary"
              icon={<LinkOutlined />}
              onClick={() => joinMeeting(record)}
              className="join-meeting-btn"
              size="small"
            >
              Tham gia
            </Button>
          ) : (
            <Text type="secondary">--</Text>
          )}
        </div>
      ),
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className="status-tag">
            {config.text}
          </Tag>
        );
      },
      width: 140,
      filters: [
        { text: "Tất cả", value: "ALL" },
        { text: "Chờ tư vấn", value: "PENDING" },
        { text: "Đang diễn ra", value: "IN_PROGRESS" },
        { text: "Đã hoàn thành", value: "COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
      ],
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedConsultation(record);
            setDetailModalVisible(true);
          }}
          className="view-detail-btn"
        >
          Chi tiết
        </Button>
      ),
      width: 80,
    },
  ];

  const getUpcomingConsultations = () => {
    return consultations.filter(
      (item) =>
        item.status === "PENDING" &&
        dayjs(item.date + " " + item.time).isAfter(dayjs())
    ).length;
  };

  const getCompletedConsultations = () => {
    return consultations.filter((item) => item.status === "COMPLETED").length;
  };

  return (
    <>
      <Navbar />
      <div className="view-advise-page">
        <div className="view-advise-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="title-section">
                <CalendarOutlined className="page-icon" />
                <div>
                  <Title level={2} className="page-title">
                    Lịch tư vấn của tôi
                  </Title>
                  <Text className="page-subtitle">
                    Quản lý và theo dõi các buổi tư vấn cai thuốc lá
                  </Text>
                </div>
              </div>

              <Button
                icon={<ReloadOutlined />}
                onClick={fetchConsultations}
                loading={loading}
                className="refresh-btn"
              >
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="stats-section">
            <Col xs={24} sm={8}>
              <Card className="stat-card upcoming">
                <div className="stat-content">
                  <div className="stat-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">
                      {getUpcomingConsultations()}
                    </div>
                    <div className="stat-label">Buổi sắp tới</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card completed">
                <div className="stat-content">
                  <div className="stat-icon">
                    <CheckCircleOutlined />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">
                      {getCompletedConsultations()}
                    </div>
                    <div className="stat-label">Đã hoàn thành</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card total">
                <div className="stat-content">
                  <div className="stat-icon">
                    <CalendarOutlined />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">{consultations.length}</div>
                    <div className="stat-label">Tổng số buổi</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Filters and Search */}
          <Card className="filters-card">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <div className="filter-group">
                  <Text strong className="filter-label">
                    <FilterOutlined /> Trạng thái:
                  </Text>
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: "100%" }}
                    className="status-select"
                  >
                    <Option value="ALL">Tất cả</Option>
                    <Option value="PENDING">Chờ tư vấn</Option>
                    <Option value="IN_PROGRESS">Đang diễn ra</Option>
                    <Option value="COMPLETED">Đã hoàn thành</Option>
                    <Option value="CANCELLED">Đã hủy</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={10}>
                <div className="filter-group">
                  <Text strong className="filter-label">
                    <SearchOutlined /> Tìm kiếm:
                  </Text>
                  <Search
                    placeholder="Tìm theo tên coach hoặc ghi chú..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                  />
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <div className="result-count">
                  <Text type="secondary">
                    Hiển thị: {filteredConsultations.length}/
                    {consultations.length}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Quick Info Alert */}
          <Alert
            message="Thông tin quan trọng"
            description="Mỗi buổi tư vấn kéo dài 60 phút. Vui lòng tham gia đúng giờ để đảm bảo chất lượng tư vấn tốt nhất."
            type="info"
            showIcon
            className="info-alert"
          />

          {/* Consultations Table */}
          <Card className="table-card">
            <Table
              columns={columns}
              dataSource={filteredConsultations}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} buổi tư vấn`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="Chưa có buổi tư vấn nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              className="consultations-table"
              scroll={{ x: 800 }}
              rowClassName={(record) => {
                const config = getStatusConfig(record.status);
                return `table-row-${record.status.toLowerCase()}`;
              }}
            />
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="modal-title">
            <CalendarOutlined className="modal-icon" />
            Chi tiết buổi tư vấn
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedConsultation?.status === "PENDING" && (
            <Button
              key="join"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => {
                joinMeeting(selectedConsultation);
                setDetailModalVisible(false);
              }}
            >
              Tham gia ngay
            </Button>
          ),
        ]}
        width={700}
        className="consultation-detail-modal"
      >
        {selectedConsultation && (
          <div className="consultation-detail">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className="detail-header">
                  <Avatar
                    size={60}
                    src={selectedConsultation.coachAvatar}
                    icon={<UserOutlined />}
                    className="detail-avatar"
                  />
                  <div className="detail-header-info">
                    <Title level={4} className="coach-title">
                      {selectedConsultation.coachName}
                    </Title>
                    <Tag
                      color={getStatusConfig(selectedConsultation.status).color}
                    >
                      {getStatusConfig(selectedConsultation.status).text}
                    </Tag>
                  </div>
                </div>
              </Col>

              <Col span={24}>
                <Divider />
              </Col>

              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Ngày tư vấn:</Text>
                  <Text>
                    {dayjs(selectedConsultation.date).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Thời gian:</Text>
                  <Text>
                    {selectedConsultation.time} - {selectedConsultation.endTime}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Thời lượng:</Text>
                  <Text>60 phút</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Nền tảng:</Text>
                  <Text>{selectedConsultation.platform}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div className="detail-item">
                  <Text strong>Nội dung tư vấn:</Text>
                  <Text>{selectedConsultation.notes}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div className="detail-item">
                  <Text strong>Đăng ký lúc:</Text>
                  <Text>
                    {dayjs(selectedConsultation.createdAt).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </Text>
                </div>
              </Col>

              {selectedConsultation.completedAt && (
                <Col span={24}>
                  <div className="detail-item">
                    <Text strong>Hoàn thành lúc:</Text>
                    <Text>
                      {dayjs(selectedConsultation.completedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                  </div>
                </Col>
              )}

              {selectedConsultation.meetingLink && (
                <Col span={24}>
                  <div className="detail-item">
                    <Text strong>Link tham gia:</Text>
                    <Button
                      type="link"
                      onClick={() =>
                        window.open(selectedConsultation.meetingLink, "_blank")
                      }
                      className="meeting-detail-link"
                    >
                      {selectedConsultation.meetingLink}
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
}

export default ViewAdvise;
