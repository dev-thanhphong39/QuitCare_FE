import React, { useEffect, useState } from "react";

import { HomeOutlined, HistoryOutlined } from "@ant-design/icons";
import useGetParams from "../../hook/useGetParam";
import { useNavigate } from "react-router-dom";
import { Result, Button, Descriptions, Spin, Card } from "antd";
const PaymentResult = () => {
  const getParam = useGetParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("success");

  const transactionStatus = getParam("vnp_TransactionStatus");

  const paymentDetails = {
    transactionNo: getParam("vnp_TransactionNo"),
    amount: Number(getParam("vnp_Amount") || 0) / 100,
    bank: getParam("vnp_BankCode"),
    cardType: getParam("vnp_CardType"),
    payDate: getParam("vnp_PayDate"),
  };

  const formatVNPayDate = (rawDateStr) => {
    if (!rawDateStr || rawDateStr.length !== 14) return rawDateStr;
    const year = rawDateStr.slice(0, 4);
    const month = rawDateStr.slice(4, 6);
    const day = rawDateStr.slice(6, 8);
    const hour = rawDateStr.slice(8, 10);
    const minute = rawDateStr.slice(10, 12);
    const second = rawDateStr.slice(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  useEffect(() => {
    if (transactionStatus !== "00") {
      setStatus("error");
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [transactionStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <Result
          status={status}
          title={
            status === "success"
              ? "Thanh toán thành công!"
              : "Thanh toán thất bại!"
          }
          subTitle={
            status === "success"
              ? "Cảm ơn bạn đã thanh toán qua VNPay."
              : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."
          }
          extra={[
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              key="home"
            >
              Về trang chủ
            </Button>,
            <Button
              icon={<HistoryOutlined />}
              onClick={() => navigate("/history-transactions")}
              key="history"
            >
              Xem lịch sử đơn hàng
            </Button>,
          ]}
        />
        {status === "success" && (
  <Card
    title="Chi tiết giao dịch"
    bordered={false}
    style={{
      backgroundColor: "#f6ffed",
      border: "1px solid #b7eb8f",
      borderRadius: "12px",
      padding: "1.5rem",
      maxWidth: "600px",
      margin: "0 auto",
      marginTop: "2rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    }}
    headStyle={{ fontWeight: "600", fontSize: "18px", color: "#389e0d" }}
  >
    <Descriptions column={1} layout="horizontal" labelStyle={{ fontWeight: 500 }}>
      <Descriptions.Item label="Mã giao dịch">
        {paymentDetails.transactionNo}
      </Descriptions.Item>
      <Descriptions.Item label="Số tiền">
        {paymentDetails.amount.toLocaleString("vi-VN")} VND
      </Descriptions.Item>
      <Descriptions.Item label="Ngân hàng">
        {paymentDetails.bank}
      </Descriptions.Item>
      <Descriptions.Item label="Loại thẻ">
        {paymentDetails.cardType}
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian thanh toán">
        {formatVNPayDate(paymentDetails.payDate)}
      </Descriptions.Item>
    </Descriptions>
  </Card>
)}

      </div>
    </div>
  );
};

export default PaymentResult;
