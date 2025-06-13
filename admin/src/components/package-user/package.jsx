import React from "react";
import "./package.css";
import freeCard from "../../assets/images/pack2.png";
import premiumCard from "../../assets/images/pack1.png";

const Package = () => {
  return (
    <div className="package-section">
      <h2 className="title">
        Đặc Quyền <br /> Hội Viên
      </h2>
      <p className="desc">
        Chúng tôi cung cấp các gói hỗ trợ linh hoạt, phù hợp với nhu cầu của
        từng cá nhân trong hành trình cai thuốc. Bạn có thể lựa chọn nâng cấp
        gói sử dụng để được tư vấn sớm từ các chuyên gia.
        <br />
        Ngoài ra, chúng tôi thường xuyên triển khai các chương trình ưu đãi cho
        người dùng đăng ký sớm, người dùng quay lại, hoặc nhóm bạn đồng hành,
        giúp bạn tiết kiệm chi phí và tăng hiệu quả cai thuốc lâu dài.
      </p>

      <div className="card-wrapper">
        <div className="card">
          <img src={freeCard} alt="Free Membership Card" className="card-img" />
          <div className="info">
            <h3 className="package-name free">GÓI FREE</h3>
            <p className="price">0 VND</p>
            <p className="benefit">
              Trải nghiệm các tính năng hỗ trợ bỏ thuốc cơ bản
            </p>
            <button className="btn btn-free">Dùng ngay</button>
          </div>
        </div>

        <div className="card">
          <img
            src={premiumCard}
            alt="Premium Membership Card"
            className="card-img"
          />
          <div className="info">
            <h3 className="package-name premium">GÓI PREMIUM</h3>
            <p className="price">499,000 VND</p>
            <p className="benefit">
              Hưởng trọn bộ đặc quyền nâng cao với chuyên gia
            </p>
            <button className="btn btn-premium">Mua gói </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Package;
