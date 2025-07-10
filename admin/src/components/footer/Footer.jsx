// admin/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h2>Về chúng tôi</h2>
          <p>
            Chúng tôi là tổ chức phi lợi nhuận hỗ trợ người dân cai nghiện thuốc
            lá thông qua các khóa học, tư vấn, tài liệu, và cộng đồng đồng hành.
          </p>
          <ul>
            <li>Số điện thoại: 1800 6969</li>
            <li>
              Email:{" "}
              <a href="mailto:contact@quitcare.com">contact@quitcare.com</a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h2>Dịch vụ</h2>
          <ul>
            <li>
              <Link to="/">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/booking">Đặt lịch</Link>
            </li>
            <li>
              <Link to="/ranking">Bảng xếp hạng</Link>
            </li>
            <li>
              <Link to="/planning">Lập kế hoạch</Link>
            </li>
          </ul>
        </div>
        <div className="footer-links">
          <h2>Tin tức</h2>
          <ul>
            <li>
              <Link to="/blog">Kiến thức cai thuốc</Link>
            </li>
            <li>
              <Link to="/blog">Tập luyện & Sức khỏe</Link>
            </li>
            <li>
              <Link to="/blog">Câu chuyện thành công</Link>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h2>Kết nối với chúng tôi</h2>
          <ul>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube"></i> YouTube
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-tiktok"></i> TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2025 QuitCare.org. Hành trình không khói thuốc bắt đầu từ hôm
          nay.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
