import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import { useNavigate } from "react-router";

function AuthenTemplate({ isLogin }) {
  const navigate = useNavigate();
  return (
    <div className="authen-template" style={{ position: "relative" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "8px 14px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          width: "auto", 
          maxWidth: "150px", 
          zIndex: 10,
          textAlign: "center",
        }}
      >
        ← Trang chủ
      </button>

      <div className="authen-template__form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template__image"></div>
    </div>
  );
}

export default AuthenTemplate;
