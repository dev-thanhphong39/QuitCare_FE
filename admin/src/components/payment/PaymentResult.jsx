// src/components/payment/PaymentResult.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
import "./PaymentResult.css"; // Tùy chỉnh nếu cần

const PaymentResult = () => {
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading | success | fail
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get("status");
    const txnId = queryParams.get("transactionId");
    const bank = queryParams.get("vnp_BankCode");
    const amount = queryParams.get("vnp_Amount");
    const code = queryParams.get("code");
    const error = queryParams.get("error");

    if (statusParam === "success") {
      setStatus("success");
      setMessage("Thanh toán thành công!");
      setDetails({
        txnId,
        bank,
        amount,
      });
    } else if (statusParam === "FAILED" || statusParam === "fail") {
      setStatus("fail");
      setMessage("Thanh toán thất bại.");
      setDetails({
        code,
        error,
      });
    } else {
      setStatus("fail");
      setMessage("Không thể xác minh trạng thái thanh toán.");
    }
  }, [location.search]);

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
          {details.txnId && <p>Mã giao dịch: {details.txnId}</p>}
          {details.bank && <p>Ngân hàng: {details.bank}</p>}
          {details.amount && (
            <p>
              Số tiền: {(Number(details.amount) / 100).toLocaleString("vi-VN")} VND
            </p>
          )}
        </div>
      )}

      {status === "fail" && (
        <div className="fail">
          <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 64 }} />
          <h2>{message}</h2>
          {details.code && <p>Mã lỗi: {details.code}</p>}
          {details.error && <p>Chi tiết lỗi: {details.error}</p>}
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
