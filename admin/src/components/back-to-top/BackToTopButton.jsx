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

  // Cuộn mượt về đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // mượt mà tự động
    });
  };

  return (
    visible && (
      <button className="back-to-top" onClick={scrollToTop}>
        <i className="fa-solid fa-angle-up"></i>
      </button>
    )
  );
}

export default BackToTopButton;
