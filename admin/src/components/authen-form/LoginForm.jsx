import React, { use } from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../configs/axios";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginForm = ({ onLogin, errorMessage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log("Login data:", values);
    try {
      const response = await api.post("/auth/login", values);

      const user = response.data;
      dispatch(login(user));

      localStorage.setItem("token", user.token);

      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "GUEST" || user.role === "CUSTOMER") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập không thành công, vui lòng thử lại sau!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };

  // Login Google Login

  return (
    <div className="login-container">
      <Card
        className="login-card"
        title="Đăng nhập"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        {errorMessage && <div className="login-error">{errorMessage}</div>}

        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login-form"
        >
          <Form.Item
            label="Tài khoản"
            name="email"
            className="login-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" className="login-input" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            className="login-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" className="login-input" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            className="login-form-item-remember"
          >
            <Checkbox className="login-checkbox">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Form.Item className="login-form-item">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="login-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <div className="login-divider">hoặc</div>
          {/* <Button className="login-google-button" block icon={<FcGoogle />}>
            Đăng nhập với Google 🚀{" "}
          </Button>
          ; */}

          <div className="google-login">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const userData = jwtDecode(credentialResponse.credential);
                console.log("Google User:", userData);
                // onLogin?.(userData);
                dispatch(login(userData));
                navigate("/");
              }}
              onError={() => console.log("Login failed")}
            />
          </div>

          <div className="login-register-link">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="register-link">
              Đăng ký
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
