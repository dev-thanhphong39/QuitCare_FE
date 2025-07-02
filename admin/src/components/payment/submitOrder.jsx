import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageId } = location.state || {}; // Lấy từ router

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Lấy thông tin gói
  useEffect(() => {
    if (!packageId) {
      setError("Không có thông tin gói được chọn.");
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await api.get(`/membership-plans/${packageId}`);
        setPkg(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin gói:", err);
        setError("Không thể tải thông tin gói.");
      }
    };

    fetchPackage();
  }, [packageId]);

  // Xử lý thanh toán
  const handlePayment = async () => {
    setError("");
    setLoading(true);

    if (!accountId || !packageId) {
      setError("Thiếu thông tin tài khoản hoặc gói.");
      setLoading(false);
      return;
    }

    if (!pkg || typeof pkg.price !== "number") {
      setError("Thông tin gói không hợp lệ hoặc thiếu giá.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Gửi request đến:", `/v1/payments/initiate/${packageId}/by-account/${accountId}`);
      console.log("💰 amountToAdd:", pkg.price);

      const res = await api.post(
        `/api/v1/payments/initiate/${packageId}/by-account/${accountId}` // 🚫 KHÔNG GỬI BODY
      );
  

      console.log("✅ Response khởi tạo thanh toán:", res.data);

      const paymentUrl = res.data?.startsWith("redirect:")
        ? res.data.split("redirect:")[1]
        : null;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError("Không nhận được URL thanh toán.");
        navigate("/payment-result");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi yêu cầu thanh toán:", err);
      console.log("📛 Chi tiết lỗi:", err.response?.data || err.message);
      setError("Không thể gửi yêu cầu thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <img src="/vnpay-logo.png" alt="VNPay Logo" className="vnpay-logo" />
          <h2>Xác nhận thanh toán</h2>
        </div>

        {pkg ? (
          <div className="order-details">
            <p className="order-title">Thông tin đơn hàng</p>
            <div className="order-item">
              <span>Tên gói</span>
              <span>{pkg.name}</span>
            </div>
            <div className="order-item">
              <span>Mô tả</span>
              <span>{pkg.description}</span>
            </div>
            <div className="order-item total">
              <span>Tổng số tiền</span>
              <span className="amount-highlight">
                {formatCurrency(pkg.price)}
              </span>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin gói...</p>
        )}

        {error && <div className="payment-error">{error}</div>}

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            className="cta-button"
            disabled={loading || !pkg}
          >
            {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
          </button>
          <p className="secure-note">
            Bạn sẽ được chuyển đến cổng thanh toán an toàn của VNPay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
