import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard-coach/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Quản lý Tư Vấn", "calendar", <CalendarOutlined />),
  getItem("Đăng ký lịch làm", "register", <ClockCircleOutlined />),
];

const CoachDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {collapsed ? "QC" : "QuitCare Coach"}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["calendar"]}
          mode="inline"
          items={items}
          style={{
            border: "none",
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#1890ff",
            }}
          >
            Dashboard Coach
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <UserOutlined style={{ fontSize: 18, color: "#666" }} />
            <span style={{ color: "#666" }}>Coach Dashboard</span>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{
              margin: "16px 0",
              padding: "8px 16px",
              background: "#fafafa",
              borderRadius: 6,
            }}
            items={[{ title: "Dashboard" }, { title: "Coach" }]}
          />
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 112px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Outlet />
            {/* Đây là nội dung chính */}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#f0f2f5",
            borderTop: "1px solid #d9d9d9",
          }}
        >
          QuitCare Coach Dashboard ©{new Date().getFullYear()} - Hỗ trợ cai
          thuốc lá
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CoachDashboard;
