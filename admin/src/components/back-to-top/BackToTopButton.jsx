import React, { useEffect, useState } from "react";
import "./BackToTopButton.css";

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Cuộn lên đầu trang từ từ (tự custom)
  const scrollToTop = () => {
    const scrollStep = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 0) {
        window.scrollTo(0, currentScroll - 40); // tốc độ cuộn, giảm giá trị để cuộn chậm hơn
        window.requestAnimationFrame(scrollStep);
      }
    };
    window.requestAnimationFrame(scrollStep);
  };

  return (
    visible && (
      <button className="back-to-top" onClick={scrollToTop}>
        <i class="fa-solid fa-angle-up"></i>
      </button>
    )
  );
}

export default BackToTopButton;
