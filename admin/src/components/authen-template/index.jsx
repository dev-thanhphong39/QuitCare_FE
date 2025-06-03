import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import { useNavigate } from "react-router-dom";

function AuthenTemplate({ isLogin }) {
  const navigate = useNavigate();
  return (
    
    <div className="authen-template" style={{ position: "relative" }}>
      <div className="authen-template__form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template__image"></div>
    </div>
  );
}

export default AuthenTemplate;
