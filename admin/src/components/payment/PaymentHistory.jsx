import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Alert } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../configs/axios";
import dayjs from "dayjs";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./PaymentHistory.css";

const { Title } = Typography;

const HistoryPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/v1/payments/history/account/${accountId}`);
        const sortedPayments = res.data.sort((a, b) => a.id - b.id);
        setPayments(sortedPayments);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchPayments();
    }
  }, [accountId]);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="payment-transaction-id">#{id}</span>,
    },
    {
      title: "Số tiền đã thanh toán",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => (
        <span className="payment-amount">
          {amount.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusClass =
          status === "SUCCESS"
            ? "payment-status-success"
            : status === "PENDING"
            ? "payment-status-pending"
            : "payment-status-failed";

        return (
          <span className={statusClass}>
            {status === "SUCCESS"
              ? "Thành công"
              : status === "PENDING"
              ? "Đang xử lý"
              : "Thất bại"}
          </span>
        );
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="payment-date">
          {dayjs(date).format("HH:mm DD/MM/YYYY")}
        </span>
      ),
    },
  ];

  // Calculate statistics
  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amountPaid,
    0
  );
  const successCount = payments.filter((p) => p.status === "SUCCESS").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <>
      <Navbar />
      <div className="payment-history-container">
        <div className="payment-history-wrapper">
          <div className="payment-history-header">
            <Title className="payment-history-title">Lịch sử thanh toán</Title>
            <p className="payment-history-subtitle">
              Theo dõi tất cả các giao dịch thanh toán của bạn
            </p>
          </div>

          {!loading && payments.length > 0 && (
            <div className="payment-statistics">
              <div className="payment-stat-card">
                <DollarOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">
                  {totalAmount.toLocaleString("vi-VN")} VND
                </div>
                <div className="payment-stat-label">Tổng số tiền</div>
              </div>
              <div className="payment-stat-card">
                <CheckCircleOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">{successCount}</div>
                <div className="payment-stat-label">Giao dịch thành công</div>
              </div>
              <div className="payment-stat-card">
                <ClockCircleOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">{pendingCount}</div>
                <div className="payment-stat-label">Đang xử lý</div>
              </div>
            </div>
          )}

          <div className="payment-history-card">
            {loading ? (
              <div className="payment-history-loading">
                <Spin size="large" />
                <div className="payment-history-loading-text">
                  Đang tải lịch sử thanh toán...
                </div>
              </div>
            ) : payments.length === 0 ? (
              <div className="payment-history-empty">
                <DollarOutlined className="payment-history-empty-icon" />
                <div className="payment-history-empty-title">
                  Chưa có giao dịch nào
                </div>
                <div className="payment-history-empty-desc">
                  Bạn chưa thực hiện giao dịch thanh toán nào
                </div>
              </div>
            ) : (
              <div className="payment-history-table">
                <Table
                  dataSource={payments}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    pageSize: 8,
                    showSizeChanger: false,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} giao dịch`,
                  }}
                  bordered={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistoryPayment;
