import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Eventos from "../pages/Eventos";
import Participantes from "../pages/Participantes";
import Ingressos from "../pages/Ingressos";
import ComprarIngresso from "../pages/ComprarIngresso";
import Relatorios from "../pages/Relatorios";
import Configuracoes from "../pages/Configuracoes";
import PrivateRoute from "../auth/PrivateRoute";
import AdminRoute from "../auth/AdminRoute";
import Administradores from "../pages/Administradores";
import EventoDetalhe from "../pages/EventoDetalhe"; // 👈 novo
import EditarEvento from "../pages/EditarEvento"; // 👈 novo

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="eventos/:id" element={<EventoDetalhe />} /> {/* 👈 ESSENCIAL */}
        <Route path="eventos/editar/:id" element={<EditarEvento />} />
        <Route path="participantes" element={<AdminRoute><Participantes /></AdminRoute>} />
        <Route path="ingressos" element={<AdminRoute><Ingressos /></AdminRoute>} />
        <Route path="comprar" element={<ComprarIngresso />} />
        <Route path="relatorios" element={<AdminRoute><Relatorios /></AdminRoute>} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="admins" element={<Administradores />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
