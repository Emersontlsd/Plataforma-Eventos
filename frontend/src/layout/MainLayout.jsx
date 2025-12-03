import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import HeaderBar from "./HeaderBar";
import MenuLateral from "./MenuLateral";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MenuLateral collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 220, transition: "all .2s" }}>
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: 16 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, minHeight: "calc(100vh - 120px)" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
