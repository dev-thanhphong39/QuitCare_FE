import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  message,
  Spin,
  Empty,
  Card,
  Tag,
  Button,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  BellOutlined,
  ReloadOutlined,
  TrophyOutlined,
  DollarOutlined,
  FireOutlined, // Thay thế SmokingOutlined
} from "@ant-design/icons";
import "./NotificationPage.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";

function NotificationPage() {
  const accountId = localStorage.getItem("accountId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalPoints: 0,
    totalMoneySaved: 0,
    totalCigarettesSmoked: 0,
    totalNotifications: 0,
  });

  // Mapping cho messageStatus
  const messageStatusMapping = {
    NORMAL: "Bình thường",
    URGENT: "Khẩn cấp",
    INFO: "Thông tin",
  };

  // Lấy danh sách thông báo và thông tin progress
  // Phiên bản đơn giản hơn - chỉ lấy thông báo cho progress mới nhất
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      console.log("🔍 AccountId hiện tại:", accountId);

      // Lấy tất cả progress và sắp xếp theo ngày mới nhất
      const progressResponse = await api.get("/quit-progress");
      console.log("📋 Tất cả progress:", progressResponse.data);

      if (!progressResponse.data || progressResponse.data.length === 0) {
        setNotifications([]);
        setTotalStats({
          totalPoints: 0,
          totalMoneySaved: 0,
          totalCigarettesSmoked: 0,
          totalNotifications: 0,
        });
        return;
      }

      // Sắp xếp progress theo ngày mới nhất
      const sortedProgress = progressResponse.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Lấy progress mới nhất
      const latestProgress = sortedProgress[0];
      console.log("📋 Progress mới nhất:", latestProgress);

      // Lấy thông báo cho progress mới nhất
      try {
        const notificationResponse = await api.get(
          `/message-notifications/by-progress/${latestProgress.id}`
        );

        console.log("📨 Thông báo:", notificationResponse.data);

        let formattedNotifications = [];
        if (notificationResponse.data && notificationResponse.data.length > 0) {
          formattedNotifications = notificationResponse.data.map(
            (notification) => ({
              id: notification.id,
              content: notification.content,
              messageStatus: notification.messageStatus,
              quitProgressId: notification.quitProgressId,
              displayDate: latestProgress.date,
              cigarettes_smoked: latestProgress.cigarettes_smoked || 0,
              money_saved: latestProgress.money_saved || 0,
              point: latestProgress.point || 0,
            })
          );
        }

        // Cập nhật state
        setNotifications(formattedNotifications);
        setTotalStats({
          totalPoints: latestProgress.point || 0,
          totalMoneySaved: latestProgress.money_saved || 0,
          totalCigarettesSmoked: latestProgress.cigarettes_smoked || 0,
          totalNotifications: formattedNotifications.length,
        });

        console.log("🔔 Kết quả cuối cùng:", formattedNotifications);
      } catch (error) {
        console.error("❌ Lỗi lấy thông báo:", error);

        // Nếu không có thông báo, vẫn hiển thị stats từ progress
        setNotifications([]);
        setTotalStats({
          totalPoints: latestProgress.point || 0,
          totalMoneySaved: latestProgress.money_saved || 0,
          totalCigarettesSmoked: latestProgress.cigarettes_smoked || 0,
          totalNotifications: 0,
        });
      }
    } catch (error) {
      console.error("❌ Lỗi lấy progress:", error);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Làm mới danh sách thông báo
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
    message.success("Đã cập nhật thông báo!");
  };

  // Lấy màu sắc cho trạng thái
  const getStatusColor = (messageStatus) => {
    switch (messageStatus) {
      case "URGENT":
        return "red";
      case "INFO":
        return "blue";
      case "NORMAL":
        return "green";
      default:
        return "default";
    }
  };

  // Format ngày
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  // Render thông báo với thông tin chi tiết
  const renderNotificationItem = (notification) => (
    <Card
      key={notification.id}
      className="notification-item-card"
      size="small"
      style={{ marginBottom: 16 }}
    >
      <div className="notification-header">
        <div className="notification-date">
          📅 {formatDate(notification.displayDate)}
        </div>
        <Tag color={getStatusColor(notification.messageStatus)}>
          {messageStatusMapping[notification.messageStatus] || "Bình thường"}
        </Tag>
      </div>

      <div className="notification-content">{notification.content}</div>

      {/* Hiển thị stats chi tiết */}
      <div className="notification-stats">
        <Row gutter={16}>
          <Col span={8}>
            <div className="stat-item">
              🚬 Số điếu: <strong>{notification.cigarettes_smoked}</strong>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-item">
              💰 Tiết kiệm:{" "}
              <strong>{notification.money_saved?.toLocaleString()}</strong> VND
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-item">
              🏆 Điểm: <strong>{notification.point}</strong>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  useEffect(() => {
    if (accountId) {
      fetchNotifications();
    } else {
      message.error("Vui lòng đăng nhập để xem thông báo.");
      setLoading(false);
    }
  }, [accountId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="notification-container">
          <div className="notification-loading">
            <Spin size="large" />
            <p>Đang tải thông báo...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="notification-container">
        <div className="notification-header">
          <h2 className="notification-title">
            <BellOutlined /> Thông Báo Theo Dõi
          </h2>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={refreshing}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </div>

        {/* Tổng kết thống kê */}
        <Card className="stats-summary" style={{ marginBottom: 24 }}>
          <h3>📊 Tổng Kết Theo Dõi</h3>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tổng Thông Báo"
                value={totalStats.totalNotifications}
                prefix={<BellOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng Điểm"
                value={totalStats.totalPoints}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tiền Tiết Kiệm"
                value={totalStats.totalMoneySaved}
                prefix={<DollarOutlined />}
                suffix="VND"
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng Điếu Hút"
                value={totalStats.totalCigarettesSmoked}
                prefix={<FireOutlined />}
                valueStyle={{ color: "#f5222d" }}
              />
            </Col>
          </Row>
        </Card>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <Empty
              description="Chưa có thông báo nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <p style={{ textAlign: "center", color: "#666", marginTop: 16 }}>
              Các thông báo về tiến trình cai thuốc sẽ xuất hiện tại đây
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map(renderNotificationItem)}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default NotificationPage;
