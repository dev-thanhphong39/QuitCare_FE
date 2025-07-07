import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Result, Button, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const VnpayReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = Object.fromEntries(queryParams.entries());
    setPaymentResult(query);
  }, [location.search]);

  if (!paymentResult) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Đang xác nhận thanh toán..." />
      </div>
    );
  }

  const isSuccess = paymentResult.vnp_ResponseCode === "00";

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <Card style={{ maxWidth: 600, width: "100%" }}>
        <Result
          status={isSuccess ? "success" : "error"}
          title={isSuccess ? "Giao dịch thành công" : "Giao dịch thất bại"}
          subTitle={`Mã đơn hàng: ${paymentResult.vnp_TxnRef} | Ngân hàng: ${paymentResult.vnp_BankCode}`}
          icon={
            isSuccess ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            )
          }
          extra={[
            <div key="info" style={{ textAlign: "left", marginBottom: 16 }}>
              <p>
                <strong>Số tiền:</strong>{" "}
                {(paymentResult.vnp_Amount / 100).toLocaleString()} VND
              </p>
              <p>
                <strong>Thời gian thanh toán:</strong>{" "}
                {paymentResult.vnp_PayDate}
              </p>
            </div>,
            <Button
              type="primary"
              key="history"
              onClick={() => navigate("/payment-history")}
            >
              Xem lịch sử giao dịch
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default VnpayReturn;
