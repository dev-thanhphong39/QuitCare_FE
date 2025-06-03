import React from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import { FcGoogle } from "react-icons/fc";
import "./login.css";
import { Link } from "react-router-dom";

const LoginForm = ({ onLogin, errorMessage }) => {
  const onFinish = (values) => {
    console.log("Login data:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="Đăng nhập" style={{ backgroundColor: "transparent", boxShadow: "none" }}>

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

          <Form.Item name="remember" valuePropName="checked" className="login-form-item-remember">
            <Checkbox className="login-checkbox">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item className="login-form-item">
            <Button type="primary" htmlType="submit" block className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-divider">hoặc</div>

          <Button className="login-google-button" block icon={<FcGoogle />}>
            Đăng nhập với Google
          </Button>

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
