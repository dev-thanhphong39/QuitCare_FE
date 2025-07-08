import React, { useState } from "react";
import { Card, Row, Col, Statistic, Select, Table, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrophyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./RevenueManagement.css";

const { Option } = Select;

function RevenueManagement() {
  const [timeFilter, setTimeFilter] = useState("7days");

  // ✅ Dữ liệu đơn giản
  const stats = [
    {
      title: "Tổng người dùng",
      value: 2847,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "Gói đã bán",
      value: 342,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
    },
    {
      title: "Doanh thu tháng",
      value: 125.6,
      suffix: "M VND",
      icon: <DollarOutlined />,
      color: "#722ed1",
    },
    {
      title: "Kế hoạch hoạt động",
      value: 1256,
      icon: <TrophyOutlined />,
      color: "#faad14",
    },
  ];

  // ✅ Top gói bán chạy
  const topPackages = [
    {
      key: "1",
      name: "Gói Basic",
      price: 250000,
      sold: 89,
      revenue: 22.25,
    },
    {
      key: "2",
      name: "Gói Premium ",
      price: 850000,
      sold: 32,
      revenue: 38.25,
    },
  ];

  // ✅ Đơn hàng gần đây
  const recentOrders = [
    {
      key: "1",
      date: "07/07/2025",
      customer: "Nguyễn Văn A",
      package: "Gói Premium 30 ngày",
      amount: 850000,
      status: "Đã thanh toán",
    },
    {
      key: "2",
      date: "07/07/2025",
      customer: "Trần Thị B",
      package: "Gói Standard 14 ngày",
      amount: 900000,
      status: "Đã thanh toán",
    },
    {
      key: "3",
      date: "06/07/2025",
      customer: "Lê Hoàng C",
      package: "Gói VIP 60 ngày",
      amount: 1500000,
      status: "Chờ thanh toán",
    },
    {
      key: "4",
      date: "06/07/2025",
      customer: "Phạm Thị D",
      package: "Tư vấn đơn lẻ",
      amount: 450000,
      status: "Đã thanh toán",
    },
  ];

  // ✅ Cột bảng gói dịch vụ
  const packageColumns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => `${value.toLocaleString()} VND`,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (value) => `${value} gói`,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value) => `${value}M VND`,
    },
  ];

  // ✅ Cột bảng đơn hàng
  const orderColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Gói mua",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `${value.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div className="revenue-simple">
      {/* ✅ Header đơn giản */}
      <div className="header">
        <h2>📊 Dashboard Doanh Thu</h2>
        <div className="header-actions">
          <Select
            value={timeFilter}
            onChange={setTimeFilter}
            style={{ width: 150 }}
          >
            <Option value="7days">7 ngày qua</Option>
            <Option value="30days">30 ngày qua</Option>
            <Option value="3months">3 tháng qua</Option>
          </Select>
          <Button type="primary" icon={<DownloadOutlined />}>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* ✅ Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={
                  <span style={{ color: stat.color, fontSize: 20 }}>
                    {stat.icon}
                  </span>
                }
                valueStyle={{ color: "#0c1c2c" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ Bảng và biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="🏆 Doanh thu gói">
            <Table
              columns={packageColumns}
              dataSource={topPackages}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="🛍️ Đơn hàng gần đây">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* ✅ Tóm tắt nhanh */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="💰 Tóm tắt doanh thu">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#52c41a", margin: 0 }}>31.8M VND</h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Doanh thu tuần này</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="📦 Gói bán chạy nhất">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#1890ff", margin: 0 }}>Basic 7 ngày</h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>89 gói đã bán</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="👥 Khách hàng mới">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#722ed1", margin: 0 }}>156 người</h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Tuần này</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default RevenueManagement;
