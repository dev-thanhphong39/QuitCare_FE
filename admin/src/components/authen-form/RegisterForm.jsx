import React from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import { Link } from "react-router-dom";
import "./register.css";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      await api.post("auth/register", values);
      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error("Đăng ký không thành công, vui lòng thử lại sau!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="auth-register-container">
      <Card
        className="auth-register-card"
        title="Đăng ký"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Form
          name="register"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="auth-register-form"
        >
          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="auth-register-button"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="auth-register-login-link">
            Đã có tài khoản?{" "}
            <Link to="/login" className="auth-register-login-link-a">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default RegisterForm;
