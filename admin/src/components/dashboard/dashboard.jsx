import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}> {label} </Link>,
  };
}

const items = [
  getItem("Quản lý người dùng", "users", <UserOutlined />),
  getItem("Quản lý bình luận", "comments", <PieChartOutlined />),
  getItem("Quản lý doanh thu", "revenue", <DesktopOutlined />),
  getItem("Quản lý gói", "packages", <DesktopOutlined />),
  getItem("Quản lý bài viết", "posts", <DesktopOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const currentUser = useSelector((state) => state.user);
  const isStaff = currentUser?.role === "STAFF";
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Xóa thông tin từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accountId");
    localStorage.removeItem("user");

    // Cập nhật Redux store
    dispatch(logout());
    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ height: "100%" }} // ✅ Bỏ calc vì không cần space cho home button
        />
      </Sider>

      <Layout>
        {/* ✅ Header với cả hai nút */}
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Title ở giữa */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1890ff",
            }}
          >
            QuitCare Dashboard
          </div>

          {/* ✅ Nhóm buttons ở bên phải */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Nút về trang chủ - chỉ hiển thị cho STAFF */}
            {isStaff && (
              <Button
                type="default"
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                style={{
                  backgroundColor: "#f0f8ff",
                  borderColor: "#1890ff",
                  color: "#1890ff",
                  borderRadius: "6px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(24, 144, 255, 0.1)",
                }}
              >
                Về trang chủ
              </Button>
            )}

            {/* Nút đăng xuất */}
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "6px",
                height: "36px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 112px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
