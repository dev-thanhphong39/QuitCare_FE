import React, { useState, useEffect } from "react";
import "./BannerSlide.css";
import slide1 from "../../assets/images/slide1.png";
import slide2 from "../../assets/images/slide2.png";
import slide3 from "../../assets/images/slide3.png";
import slide4 from "../../assets/images/slide4.png";


const images = [
  slide1,
  slide4,
  slide2,
  slide3,
];

function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-slider">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`slide-${idx}`}
          className={`slide ${idx === current ? "active" : ""}`}
        />
      ))}

      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
