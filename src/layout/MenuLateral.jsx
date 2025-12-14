import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const { Sider } = Layout;

export default function MenuLateral({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "/eventos", icon: <CalendarOutlined />, label: "Eventos" },
    { key: "/participantes", icon: <UserOutlined />, label: "Participantes" },
    { key: "/ingressos", icon: <DollarOutlined />, label: "Ingressos" },
    { key: "/relatorios", icon: <BarChartOutlined />, label: "Relatórios" },
    { key: "/configuracoes", icon: <SettingOutlined />, label: "Configurações" },
  ];

  // Menu Administradores apenas para admins
  if (user?.role === "admin") {
    items.push({ key: "/admins", icon: <UserOutlined />, label: "Administradores" });
  }

  // Menu Entrar se não estiver logado
  if (!user) {
    items.push({ key: "/login", icon: <UserOutlined />, label: "Entrar" });
  }

  const menu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={(i) => navigate(i.key)}
    />
  );

  // Drawer para mobile
  if (isMobile) {
    return (
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setCollapsed(true)}
        open={!collapsed}
        bodyStyle={{ padding: 0 }}
      >
        {menu}
        <div style={{ padding: 12 }}>
          {user && (
            <a onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LogoutOutlined /> Sair
            </a>
          )}
        </div>
      </Drawer>
    );
  }

  // Sider desktop
  return (
    <Sider
      collapsed={collapsed}
      width={220}
      style={{ position: "fixed", height: "100vh", left: 0, top: 0, background: "#001529" }}
    >
      <div
        style={{
          height: 64,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          fontWeight: 700,
        }}
      >
        🎟️ Plataforma
      </div>
      {menu}
      <div style={{ color: "rgba(255,255,255,0.65)", padding: 12, marginTop: "auto" }}>
        v1.0 • © 2025 EventoTech
      </div>
      {user && (
        <div style={{ padding: 12, color: "#fff", cursor: "pointer" }} onClick={logout}>
          <LogoutOutlined /> Sair
        </div>
      )}
    </Sider>
  );
}
