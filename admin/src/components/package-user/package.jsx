import React, { useEffect, useState } from "react";
import "./package.css";
import freeCard from "../../assets/images/pack2.png";
import premiumCard from "../../assets/images/pack1.png";
import api from "../../configs/axios"; // nếu bạn có file cấu hình axios sẵn
import { useNavigate } from "react-router-dom";

const Package = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Giả sử có 2 gói: ID 1 là FREE, ID 2 là PREMIUM
    const fetchPackages = async () => {
      try {
        const basicRes = await api.get(`/membership-plans/1`);
        const premiumRes = await api.get(`/membership-plans/2`);
        setPackages([
          { ...basicRes.data, image: freeCard },
          { ...premiumRes.data, image: premiumCard },
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy gói hội viên:", error);
      }
    };

    fetchPackages();
  }, []);

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
        {packages.map((pkg) => (
          <div className="card" key={pkg.id}>
            <img src={pkg.image} alt={pkg.name} className="card-img" />
            <div className="info">
              <h3
                className={`package-name ${pkg.price === 0 ? "basic" : "premium"
                  }`}
              >
                {pkg.name.toUpperCase()}
              </h3>
              <p className="price">
                {`${pkg.price.toLocaleString()} VND`}
              </p>
              <p className="benefit">{pkg.description}</p>
              <button
  className={`btn ${pkg.name.toLowerCase() === "basic" ? "btn-basic" : "btn-premium"}`}
  onClick={() => {
    navigate(`/payment?membershipPlanId=${pkg.id}`);
  }}
>
  Mua gói
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Package;
