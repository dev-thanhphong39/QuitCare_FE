// src/components/payment/PaymentResult.jsx

import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
import "./PaymentResult.css"; // CSS tùy chỉnh

const PaymentResult = () => {
  const [status, setStatus] = useState("loading"); // loading | success | fail
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const res = await api.get(`/VNP/vnpay-payment-return${window.location.search}`);
        console.log("Kết quả xác minh:", res.data);

        if (res.data && res.data.vnp_ResponseCode === "00") {
          setStatus("success");
          setMessage("Thanh toán thành công!");
          setTransactionData(res.data);
        } else {
          setStatus("fail");
          setMessage("Thanh toán thất bại hoặc bị hủy.");
        }
      } catch (error) {
        console.error("Lỗi khi xác minh thanh toán:", error);
        setStatus("fail");
        setMessage("Không thể xác minh thanh toán.");
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="payment-result-container">
      {status === "loading" && (
        <div className="loading">
          <LoadingOutlined style={{ fontSize: 36 }} spin />
          <p>Đang xác minh giao dịch...</p>
        </div>
      )}

      {status === "success" && (
        <div className="success">
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
          <h2>{message}</h2>
          <p>Mã giao dịch: {transactionData?.vnp_TxnRef}</p>
          <p>Ngân hàng: {transactionData?.vnp_BankCode}</p>
          <p>Số tiền: {(transactionData?.vnp_Amount / 100).toLocaleString("vi-VN")} VND</p>
        </div>
      )}

      {status === "fail" && (
        <div className="fail">
          <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 64 }} />
          <h2>{message}</h2>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
