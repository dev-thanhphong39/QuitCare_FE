import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Modal,
  Avatar,
  Divider,
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

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchConsultations();
    const interval = setInterval(fetchConsultations, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Hàm gọi API
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/booking/customer");
      const data = response.data;

      const transformedData = data.map((item, index) => ({
        id: index,
        coachName: item.coachName,
        date: item.appointmentDate,
        time: item.startTime,
        endTime: dayjs(item.startTime, "HH:mm:ss")
          .add(60, "minute")
          .format("HH:mm:ss"),
        status: item.status,
        meetingLink: item.googleMeetLink,
        platform: "Google Meet",
        notes: "",
        coachAvatar: "",
        createdAt: new Date().toISOString(),
        completedAt:
          item.status === "COMPLETED"
            ? dayjs(`${item.appointmentDate} ${item.startTime}`)
                .add(60, "minute")
                .toISOString()
            : null,
      }));

      setConsultations(transformedData);
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
    return configs[status] || { color: "default", text: "Không xác định" };
  };

  const joinMeeting = (consultation) => {
    if (consultation.meetingLink) {
      window.open(consultation.meetingLink, "_blank");
      message.success("Đã mở link tư vấn");
    }
  };

  const filteredConsultations = consultations.filter((item) => {
    const statusMatch = statusFilter === "ALL" || item.status === statusFilter;
    const searchMatch = item.coachName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (name, record) => (
        <div className="coach-info">
          <Avatar size={40} icon={<UserOutlined />} />
          <div className="coach-details">
            <Text strong>{name}</Text>
            <Text type="secondary">{record.platform}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày giờ",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div>
            <CalendarOutlined /> {dayjs(record.date).format("DD/MM/YYYY")}
          </div>
          <div>
            {record.time} - {record.endTime}
          </div>
        </div>
      ),
    },
    // {
    //   title: "Link tư vấn",
    //   dataIndex: "meetingLink",
    //   render: (link, record) =>
    //     record.status === "PENDING" ||
    //     record.status === "IN_PROGRESS" ? (
    //       <Button
    //         type="primary"
    //         icon={<LinkOutlined />}
    //         onClick={() => joinMeeting(record)}
    //       >
    //         Tham gia
    //       </Button>
    //     ) : (
    //       <Text type="secondary">--</Text>
    //     ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Chi tiết",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedConsultation(record);
            setDetailModalVisible(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="view-advise-page">
        <Card
          title={
            <div>
              <CalendarOutlined /> Lịch tư vấn của tôi
            </div>
          }
          extra={
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchConsultations}
            >
              Làm mới
            </Button>
          }
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="PENDING">Chờ tư vấn</Option>
                <Option value="IN_PROGRESS">Đang diễn ra</Option>
                <Option value="COMPLETED">Đã hoàn thành</Option>
                <Option value="CANCELLED">Đã hủy</Option>
              </Select>
            </Col>
            <Col span={16}>
              <Search
                placeholder="Tìm theo tên huấn luyện viên..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Alert
            message="Lưu ý"
            description="Mỗi buổi tư vấn kéo dài 60 phút. Vui lòng tham gia đúng giờ."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table
            columns={columns}
            dataSource={filteredConsultations}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty description="Chưa có buổi tư vấn nào" />
              ),
            }}
          />
        </Card>
      </div>

      {/* Modal Chi tiết */}
      <Modal
        title="Chi tiết tư vấn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedConsultation && (
          <>
            <p><strong>Coach:</strong> {selectedConsultation.coachName}</p>
            <p>
              <strong>Ngày giờ:</strong>{" "}
              {dayjs(selectedConsultation.date).format("DD/MM/YYYY")}{" "}
              {selectedConsultation.time}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {getStatusConfig(selectedConsultation.status).text}
            </p>
            {selectedConsultation.meetingLink && (
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={selectedConsultation.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedConsultation.meetingLink}
                </a>
              </p>
            )}
          </>
        )}
      </Modal>
      <Footer />
    </>
  );
}

export default ViewAdvise;
