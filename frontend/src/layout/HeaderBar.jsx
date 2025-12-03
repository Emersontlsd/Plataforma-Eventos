import React from "react";
import { Layout, Button, Avatar, Dropdown, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";

const { Header } = Layout;

export default function HeaderBar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();

  const menu = (
    <Menu>
      <Menu.Item key="profile">Perfil</Menu.Item>
      <Menu.Item key="logout" onClick={logout}>Sair</Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: "#fff", padding: "0 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <Button type="text" onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
      <div style={{ marginLeft: 8, fontWeight: 600, flex: 1 }}>Plataforma de Eventos</div>

      <BellOutlined style={{ fontSize: 18 }} />
      <Dropdown overlay={menu} placement="bottomRight">
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontWeight: 600 }}>{user?.nome || user?.email}</span>
            <small style={{ color: "rgba(0,0,0,0.45)" }}>{user?.role}</small>
          </div>
        </div>
      </Dropdown>
    </Header>
  );
}
