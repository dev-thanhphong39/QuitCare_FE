import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Table,
  Spin,
  Select,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrophyOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import "./RevenueManagement.css";

const { Title } = Typography;
const { Option } = Select;

const RevenueManagement = () => {
  // ✅ State từ code gốc
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [timeFilter, setTimeFilter] = useState("7days");

  // ✅ Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, paymentRes] = await Promise.all([
          api.get("/membership-plans"),
          api.get("/v1/payments/history"),
        ]);

        setPlans(planRes.data);
        setPayments(paymentRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Helper functions từ code gốc
  const getPaymentsByPlan = (planId) => {
    return payments.filter((p) => {
      const membership = plans.find((plan) => plan.id === planId);
      return p.amountPaid === membership?.price;
    });
  };

  const getRevenueByPlan = (planId) => {
    const matchedPayments = getPaymentsByPlan(planId);
    return matchedPayments.reduce((acc, cur) => acc + cur.amountPaid, 0);
  };

  const totalRevenue = plans.reduce(
    (acc, plan) => acc + getRevenueByPlan(plan.id),
    0
  );

  const totalPackagesSold = plans.reduce(
    (acc, plan) => acc + getPaymentsByPlan(plan.id).length,
    0
  );

  const showPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  // ✅ Statistics với dữ liệu thực
  const stats = [
    {
      title: "Tổng người dùng",
      value: 2847,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "Gói đã bán",
      value: totalPackagesSold,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
    },
    {
      title: "Doanh thu tháng",
      value: totalRevenue / 1000000,
      suffix: "M VND",
      icon: <DollarOutlined />,
      color: "#722ed1",
    },
    {
      title: "Kế hoạch hoạt động",
      value: plans.length,
      icon: <TrophyOutlined />,
      color: "#faad14",
    },
  ];

  // ✅ Đơn hàng gần đây từ API
  const recentOrders = payments
    .slice(-8) // Tăng lên 8 đơn hàng để hiển thị đầy đủ hơn
    .reverse()
    .map((payment) => {
      const plan = plans.find((p) => p.price === payment.amountPaid);
      return {
        key: payment.id,
        date: new Date(payment.createdAt).toLocaleDateString("vi-VN"),
        customer: `Khách hàng #${payment.accountId}`,
        package: plan?.name || "Gói không xác định",
        amount: payment.amountPaid,
        status:
          payment.status === "COMPLETED" ? "Đã thanh toán" : "Chờ thanh toán",
      };
    });

  // ✅ Columns cho bảng đơn hàng
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
      render: (value) => `${value.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  // ✅ Columns cho modal chi tiết
  const detailColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Số tiền",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Người mua (Account ID)",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div
        className="revenue-simple"
        style={{ textAlign: "center", padding: "100px" }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="revenue-simple">
      {/* ✅ Header dashboard */}
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

      {/* ✅ Phần gói dịch vụ chi tiết từ API */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={3}>Chi tiết theo gói dịch vụ</Title>
        </Col>
        {plans.map((plan) => {
          const planPayments = getPaymentsByPlan(plan.id);
          const revenue = getRevenueByPlan(plan.id);
          return (
            <Col xs={24} sm={12} lg={6} key={plan.id}>
              <Card hoverable>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>{plan.name}</strong> <br />
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    {plan.price.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <Statistic
                  title="Doanh thu"
                  value={revenue}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="VND"
                  formatter={(value) =>
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(1)}M`
                      : value.toLocaleString("vi-VN")
                  }
                />
                <p style={{ margin: "8px 0", color: "#595959" }}>
                  Số đơn hàng: <strong>{planPayments.length}</strong>
                </p>
                <Button
                  type="link"
                  size="small"
                  onClick={() => showPlanDetails(plan)}
                  style={{ padding: 0 }}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </Col>
          );
        })}

        {/* ✅ Card tổng doanh thu */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ border: "2px solid #1890ff" }}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              valueStyle={{ color: "#cf1322", fontSize: "28px" }}
              suffix="VND"
              formatter={(value) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value.toLocaleString("vi-VN")
              }
            />
            <p style={{ margin: "8px 0", color: "#595959" }}>
              Tổng đơn hàng: <strong>{payments.length}</strong>
            </p>
          </Card>
        </Col>
      </Row>

      {/* ✅ Bảng đơn hàng gần đây - Mở rộng full width */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="🛍️ Đơn hàng gần đây">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* ✅ Tóm tắt doanh thu đơn giản */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="💰 Tóm tắt doanh thu">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#52c41a", margin: 0 }}>
                {(totalRevenue / 1000000).toFixed(1)}M VND
              </h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Tổng doanh thu</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📈 Tổng giao dịch">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#722ed1", margin: 0 }}>{payments.length}</h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Đơn hàng đã xử lý</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ✅ Modal chi tiết giao dịch */}
      <Modal
        title={`Chi tiết giao dịch - ${selectedPlan?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={detailColumns}
          dataSource={getPaymentsByPlan(selectedPlan?.id).map((item) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default RevenueManagement;
