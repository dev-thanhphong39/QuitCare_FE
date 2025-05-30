import React from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import "./login.css";

function LoginForm() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-container">
      <Card className="login-card" title="Đăng nhập" variant="outlined">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            className="form-item"
          >
            <Input placeholder="Tên đăng nhập" className="login-input" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className="form-item"
          >
            <Input.Password placeholder="Mật khẩu" className="login-input" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="form-item-remember"
          >
            <Checkbox className="remember-checkbox">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item className="form-item">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="login-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginForm;
