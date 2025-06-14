import React from "react";
import bannerImg from "../../assets/images/booking.png";
import "./BannerSingle.css";

function BannerSingle() {
  return (
    <div className="banner-single">
      <img src={bannerImg} alt="Banner" className="banner-single-img" />
    </div>
  );
}

export default BannerSingle;
