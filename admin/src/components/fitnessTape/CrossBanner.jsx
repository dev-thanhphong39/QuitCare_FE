import React from "react";
import "./CrossBanner.css";

function FitnessTapeText() {
  const renderText = () =>
    Array(30)
      .fill("QUIT CARE")
      .map((text, idx) => (
        <span key={idx}>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      ));

  return (
    <div className="fitness-banner-wrapper">
      {/* Dải trên nghiêng trái */}
      <div className="fitness-text-banner banner-top">
        <div className="text-track scroll-left">
          <div className="text-slide">{renderText()}</div>
          <div className="text-slide">{renderText()}</div>
        </div>
      </div>

      {/* Dải dưới nghiêng phải */}
      <div className="fitness-text-banner banner-bottom">
        <div className="text-track scroll-right">
          <div className="text-slide">{renderText()}</div>
          <div className="text-slide">{renderText()}</div>
        </div>
      </div>
    </div>
  );
}

export default FitnessTapeText;
