import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageId } = location.state || {};

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Lấy thông tin gói từ API
  useEffect(() => {
    if (!packageId) {
      setError("Không có thông tin gói được chọn.");
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await axios.get(`http://14.225.218.238:8080/api/membership-plans/${packageId}`);
        setPkg(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin gói:", err);
        setError("Không thể tải thông tin gói.");
      }
    };

    fetchPackage();
  }, [packageId]);

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      const orderInfo = encodeURIComponent(`Thanh toán gói ${pkg.name}`);
      const res = await axios.post(
        `http://14.225.218.238:8080/api/VNP/submitOrder?amount=${pkg.price}&orderInfo=${orderInfo}`
      );

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        console.log("Không nhận được URL thanh toán.")
        setError("Không nhận được URL thanh toán.");
        navigate("/payment-result")
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu thanh toán:", err);
      setError("Không thể gửi yêu cầu thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <img
            src={'data:image/png;base64,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'} // hoặc base64 như cũ
            alt="VNPay Logo"
            className="vnpay-logo"
          />
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
              <span className="amount-highlight">{formatCurrency(pkg.price)}</span>
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
