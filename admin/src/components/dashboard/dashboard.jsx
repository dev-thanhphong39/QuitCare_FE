import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

  // Get user from Redux store (adjust this based on your Redux structure)
  const currentUser = useSelector((state) => state.user);
  const isStaff = currentUser?.role === "STAFF";
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "relative" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ height: "calc(100% - 120px)" }} // Leave space for home button
        />

        {/* Home Button - Only show for STAFF role */}
        {isStaff && (
          <div
            style={{
              position: "absolute",
              bottom: "70px",
              left: "16px",
              right: "16px",
            }}
          >
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              block
              style={{
                height: "40px",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "6px",
                fontSize: collapsed ? "14px" : "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {!collapsed && "Về trang chủ"}
            </Button>
          </div>
        )}
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
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
