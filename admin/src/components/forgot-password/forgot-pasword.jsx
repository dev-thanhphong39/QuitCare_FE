// src/components/ForgotPasswordForm.js

import React, { useState } from 'react';
import './forgot-password.css';
 
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hàm giả lập việc gọi API
  const fakeApiCall = (userEmail) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Giả lập trường hợp email tồn tại trong hệ thống
        if (userEmail === 'user@example.com') {
          resolve({ message: 'Link đặt lại mật khẩu đã được gửi thành công!' });
        } else {
          // Giả lập trường hợp email không tồn tại
          reject({ message: 'Email không tồn tại trong hệ thống.' });
        }
      }, 2000); // Giả lập độ trễ mạng 2 giây
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fakeApiCall(email);
      setSuccessMessage(response.message);
      setEmail(''); // Xóa email trong input sau khi thành công
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu đã gửi thành công, chỉ hiển thị thông báo thành công
  if (successMessage) {
    return (
      <div className="forgot-password-container">
        <div className="form-success">
          <h2>Thành công!</h2>
          <p>{successMessage}</p>
          <p>Vui lòng kiểm tra hộp thư của bạn (kể cả mục spam).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để nhận link đặt lại mật khẩu.</p>
        
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error && !email ? 'input-error' : ''}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi Link Đặt Lại'}
          </button>
        </div>

        <div className="back-to-login">
          <a href="/login">Quay lại trang Đăng nhập</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;