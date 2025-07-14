import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleBackHome = () => {
    // Điều hướng theo role
    switch (user?.role) {
      case "STAFF":
        navigate("/");
        navigate("/dashboard");
        break;
      case "COACH":
        navigate("/dashboard-coach");
        break;
      case "GUEST":
      case "CUSTOMER":
        navigate("/");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={handleBackHome}>
            Quay về trang chính
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
