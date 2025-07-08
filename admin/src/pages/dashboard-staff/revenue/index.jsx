import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Statistic, Modal, Table, Spin } from "antd";
import api from "../../../configs/axios";

const { Title } = Typography;

const RevenueManagement = () => {
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const showPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const columns = [
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

  return (
    <div className="p-6">
      <Title level={2}>Quản lý doanh thu</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-4">
            {plans.map((plan) => {
              const planPayments = getPaymentsByPlan(plan.id);
              const revenue = getRevenueByPlan(plan.id);
              return (
                <Col span={6} key={plan.id}>
                  <Card>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong>{plan.name}</strong> - {plan.price.toLocaleString("vi-VN")} VND
                    </div>
                    <Statistic
                      value={revenue}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="VND"
                    />
                    <p>Số đơn hàng: {planPayments.length}</p>
                    <a onClick={() => showPlanDetails(plan)}>Xem chi tiết</a>
                  </Card>
                </Col>
              );
            })}

            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={totalRevenue}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="VND"
                />
              </Card>
            </Col>
          </Row>

          <Modal
            title={`Chi tiết giao dịch - ${selectedPlan?.name}`}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
          >
            <Table
              columns={columns}
              dataSource={getPaymentsByPlan(selectedPlan?.id).map((item) => ({
                ...item,
                key: item.id,
              }))}
              pagination={{ pageSize: 5 }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default RevenueManagement;
