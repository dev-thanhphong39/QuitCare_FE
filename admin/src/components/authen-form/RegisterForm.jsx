import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./register.css";

function RegisterForm() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Đăng ký</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="register-form"
        >
          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            className="form-item"
          >
            <Input className="register-input" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            className="form-item"
          >
            <Input className="register-input" />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
            className="form-item"
          >
            <Input className="register-input" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
            ]}
            hasFeedback
            className="form-item"
          >
            <Input.Password className="register-input" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
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
            className="form-item"
          >
            <Input.Password className="register-input" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="form-item-remember"
          >
            <Checkbox className="remember-checkbox">Ghi nhớ tôi</Checkbox>
          </Form.Item>

          <Form.Item className="form-item">
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;
