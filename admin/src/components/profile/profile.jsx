import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  message,
  Table,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Empty,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CalendarOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../configs/axios";
import { login } from "../../redux/features/userSlice";
import "./profile.css";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullName || "",
    gender: user?.gender || "MALE",
  });

  // State for consultation history
  const [consultations, setConsultations] = useState([]);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchConsultationHistory();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`user/${user.id}`, {
        fullname: form.fullname,
        gender: form.gender,
      });

      dispatch(
        login({
          ...response.data,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            response.data.fullname
          )}&background=4f46e5&color=ffffff&size=128&rounded=true`,
        })
      );

      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultationHistory = async () => {
    setConsultationLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/consultations/user/${user.id}`);
      // setConsultations(response.data);

      // Mock data with fixed 60 minutes duration
      const mockData = [
        {
          id: 1,
          date: "2025-07-05",
          time: "10:00",
          coachName: "Bác sĩ Nguyễn Văn A",
          meetingLink: "https://meet.google.com/abc-def-ghi",
          status: "PENDING",
          notes: "Tư vấn về kế hoạch cai thuốc",
          duration: 60, // Fixed duration
          type: "VIDEO_CALL",
        },
        {
          id: 2,
          date: "2025-07-04",
          time: "15:00",
          coachName: "Bác sĩ Trần Thị B",
          meetingLink: "https://zoom.us/j/123456789",
          status: "COMPLETED",
          notes: "Đánh giá tiến trình cai thuốc tuần 1",
          duration: 60, // Fixed duration
          type: "VIDEO_CALL",
        },
        {
          id: 3,
          date: "2025-07-03",
          time: "09:30",
          coachName: "Bác sĩ Lê Văn C",
          meetingLink: "https://meet.google.com/xyz-abc-def",
          status: "CANCELLED",
          notes: "Hủy do lịch trình thay đổi",
          duration: 60, // Fixed duration
          type: "VIDEO_CALL",
        },
        {
          id: 4,
          date: "2025-07-02",
          time: "14:00",
          coachName: "Bác sĩ Phạm Thị D",
          meetingLink: "https://zoom.us/j/987654321",
          status: "COMPLETED",
          notes: "Tư vấn khởi đầu và đánh giá ban đầu",
          duration: 60, // Fixed duration
          type: "VIDEO_CALL",
        },
      ];

      setConsultations(mockData);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử tư vấn:", error);
      message.error("Không thể tải lịch sử tư vấn");
    } finally {
      setConsultationLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "orange",
        text: "Chờ tư vấn",
        icon: <ClockCircleOutlined />,
      },
      COMPLETED: {
        color: "green",
        text: "Đã hoàn thành",
        icon: <CheckCircleOutlined />,
      },
      CANCELLED: {
        color: "red",
        text: "Đã hủy",
        icon: <ExclamationCircleOutlined />,
      },
      IN_PROGRESS: {
        color: "blue",
        text: "Đang diễn ra",
        icon: <PlayCircleOutlined />,
      },
    };
    return (
      configs[status] || {
        color: "default",
        text: "Không xác định",
        icon: null,
      }
    );
  };

  const filteredConsultations = consultations.filter((item) => {
    return statusFilter === "ALL" || item.status === statusFilter;
  });

  const consultationColumns = [
    {
      title: "Ngày giờ",
      key: "datetime",
      render: (_, record) => (
        <div className="datetime-cell">
          <div className="date">{dayjs(record.date).format("DD/MM/YYYY")}</div>
          <div className="time">{record.time}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (name) => (
        <div className="coach-cell">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          <Text strong>{name}</Text>
        </div>
      ),
    },
    {
      title: "Link tư vấn",
      dataIndex: "meetingLink",
      key: "meetingLink",
      render: (link, record) => (
        <Space>
          {record.status === "PENDING" || record.status === "IN_PROGRESS" ? (
            <Button
              type="link"
              icon={<LinkOutlined />}
              onClick={() => window.open(link, "_blank")}
              className="meeting-link-btn"
            >
              Tham gia
            </Button>
          ) : (
            <Text type="secondary">--</Text>
          )}
        </Space>
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
          className="action-btn"
        >
          Chi tiết
        </Button>
      ),
      width: 80,
    },
  ];

  const renderPersonalInfo = () => (
    <Card className="profile-info-card" title="Thông tin cá nhân">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className="avatar-section">
            <Avatar
              size={120}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.fullname || "User"
              )}&background=4f46e5&color=ffffff&size=120&rounded=true`}
              className="profile-avatar"
            />
            <div className="avatar-info">
              <Title level={4} className="mb-1">
                {user?.fullName || "Người dùng"}
              </Title>
              <Text type="secondary">{user?.email}</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <div className="info-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="readonly-input"
                    prefix={<UserOutlined />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập</label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="readonly-input"
                    prefix={<UserOutlined />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Tên đầy đủ</label>
                  <Input
                    value={form.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"}
                    placeholder="Nhập tên đầy đủ"
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <Select
                    value={form.gender}
                    onChange={(value) => handleChange("gender", value)}
                    disabled={!isEditing}
                    className={
                      isEditing ? "editable-select" : "readonly-select"
                    }
                  >
                    <Option value="MALE">Nam</Option>
                    <Option value="FEMALE">Nữ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div className="action-buttons">
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button
                    onClick={() => {
                      setForm({
                        fullname: user?.fullName || "",
                        gender: user?.gender || "MALE",
                      });
                      setIsEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={handleSubmit}
                    className="save-btn"
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderConsultationHistory = () => (
    <Card
      className="consultation-history-card"
      title={
        <div className="card-header">
          <div className="header-left">
            <CalendarOutlined className="header-icon" />
            <span>Lịch tư vấn</span>
            <Badge count={consultations.length} className="count-badge" />
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchConsultationHistory}
            loading={consultationLoading}
            type="text"
          >
            Làm mới
          </Button>
        </div>
      }
    >
      {/* Simplified Filters - Only Status */}
      <div className="consultation-filters">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div className="filter-group">
              <Text strong className="filter-label">
                <FilterOutlined className="mr-1" />
                Trạng thái:
              </Text>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="status-filter"
                style={{ width: "100%" }}
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="PENDING">Chờ tư vấn</Option>
                <Option value="COMPLETED">Đã hoàn thành</Option>
                <Option value="CANCELLED">Đã hủy</Option>
                <Option value="IN_PROGRESS">Đang diễn ra</Option>
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="stats-summary">
              <Text type="secondary">
                Hiển thị: {filteredConsultations.length}/{consultations.length}{" "}
                buổi tư vấn
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="duration-info">
              <Text strong className="text-blue-600">
                ⏱️ Mỗi buổi: 60 phút
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Table
        columns={consultationColumns}
        dataSource={filteredConsultations}
        rowKey="id"
        loading={consultationLoading}
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
        className="consultation-table"
        scroll={{ x: 700 }}
      />
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          {/* Page Header */}
          <div className="page-header">
            <Title level={2} className="page-title">
              <UserOutlined className="title-icon" />
              Hồ sơ cá nhân
            </Title>
            <Text type="secondary" className="page-subtitle">
              Quản lý thông tin cá nhân và xem lịch tư vấn
            </Text>
          </div>

          {/* Personal Information - Always visible at top */}
          <div className="personal-info-section">{renderPersonalInfo()}</div>

          {/* Divider */}
          <Divider className="section-divider" />

          {/* Consultation History */}
          <div className="consultation-section">
            {renderConsultationHistory()}
          </div>
        </div>
      </div>

      {/* Consultation Detail Modal */}
      <Modal
        title="Chi tiết buổi tư vấn"
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
              onClick={() =>
                window.open(selectedConsultation?.meetingLink, "_blank")
              }
            >
              Tham gia tư vấn
            </Button>
          ),
        ]}
        width={600}
        className="consultation-detail-modal"
      >
        {selectedConsultation && (
          <div className="consultation-detail">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Ngày:</Text>
                  <Text>
                    {dayjs(selectedConsultation.date).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Giờ:</Text>
                  <Text>{selectedConsultation.time}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Thời gian:</Text>
                  <Text>60 phút</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <Text strong>Trạng thái:</Text>
                  <Tag
                    color={getStatusConfig(selectedConsultation.status).color}
                  >
                    {getStatusConfig(selectedConsultation.status).text}
                  </Tag>
                </div>
              </Col>
              <Col span={24}>
                <div className="detail-item">
                  <Text strong>Huấn luyện viên:</Text>
                  <Text>{selectedConsultation.coachName}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div className="detail-item">
                  <Text strong>Ghi chú:</Text>
                  <Text>{selectedConsultation.notes}</Text>
                </div>
              </Col>
              {selectedConsultation.meetingLink && (
                <Col span={24}>
                  <div className="detail-item">
                    <Text strong>Link tư vấn:</Text>
                    <Button
                      type="link"
                      onClick={() =>
                        window.open(selectedConsultation.meetingLink, "_blank")
                      }
                      className="meeting-link"
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
};

export default Profile;
