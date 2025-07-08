import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Alert } from "antd";
import api from "../../configs/axios"; // đảm bảo đã cấu hình axios baseURL
import dayjs from "dayjs";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const { Title } = Typography;

const HistoryPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountId = localStorage.getItem("accountId");
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/v1/payments/history/account/${accountId}`);
        setPayments(res.data);
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
    },
    {
      title: "Số tiền đã thanh toán",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "SUCCESS" ? "green" : status === "PENDING" ? "gold" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6 bg-white rounded shadow">
      <Title level={3}>Lịch sử thanh toán</Title>
      {loading ? (
        <Spin size="large" />
      ) : payments.length === 0 ? (
        <Alert message="Không có giao dịch nào." type="info" />
      ) : (
        <Table
          dataSource={payments}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}
    </div>
    <Footer/>   
    </>
    
  );
};

export default HistoryPayment;
