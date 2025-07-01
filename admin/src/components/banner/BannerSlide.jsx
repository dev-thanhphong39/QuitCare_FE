import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "./BannerSlide.css";
import slide1 from "../../assets/images/slide1.png";
import slide2 from "../../assets/images/slide2.png";
import slide3 from "../../assets/images/slide3.png";
import slide4 from "../../assets/images/slide4.png";

const images = [slide1, slide2, slide3, slide4];

function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [snapBack, setSnapBack] = useState(false);

  const goToSlide = (index) => {
    const newIndex = (index + images.length) % images.length;
    setCurrent(newIndex);
    setDragDelta(0); // Reset luôn khi chuyển slide
  };

  // Xử lý swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => goToSlide(current + 1),
    onSwipedRight: () => goToSlide(current - 1),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10, // Giảm giá trị này để swipe nhạy hơn (mặc định là 10)
  });

  // Auto chuyển ảnh mỗi 4s
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide(current + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [current]);

  // Dùng để xử lý cursor grab ↔ grabbing
  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStartX === null) return;
    setDragDelta(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    let next = current;
    let shouldSnap = false;
    if (dragDelta > 50) {
      next = current - 1;
    } else if (dragDelta < -50) {
      next = current + 1;
    } else {
      shouldSnap = true;
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragDelta(0);

    if (shouldSnap) {
      setSnapBack(true);
      setTimeout(() => setSnapBack(false), 300); // Thời gian snap về (ms)
    } else {
      goToSlide(next);
    }
  };

  return (
    <div
      className={`banner-slider${isDragging ? " dragging" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="slider-track"
        style={{
          transform: `translateX(calc(-${current * 100}% + ${
            isDragging ? dragDelta : 0
          }px))`,
          transition: isDragging
            ? "none"
            : snapBack
            ? "transform 0.3s cubic-bezier(0.4,0,0.2,1)"
            : "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`slide-${idx}`} className="slide" />
        ))}
      </div>

      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
