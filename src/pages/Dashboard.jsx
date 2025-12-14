// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Tag, Spin } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../api/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalEventos: 0,
    totalIngressos: 0,
    totalParticipantes: 0,
    eventos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/relatorios/eventos");
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = summary.eventos.map((e) => ({
    name: e.nome,
    value: e.participantes?.length || 0,
  }));

  const barData = summary.eventos.map((e) => ({
    nome: e.nome,
    ingressos: e.ingressos?.length || 0,
  }));

  const columns = [
    { title: "Evento", dataIndex: "nome", key: "nome" },
    { title: "Local", dataIndex: "local", key: "local" },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (d) => (d ? new Date(d).toLocaleDateString("pt-BR") : ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) =>
        s === "futuro" ? <Tag color="green">Ainda vai acontecer</Tag> : <Tag color="red">Já aconteceu</Tag>,
    },
    { title: "Total Ingressos", dataIndex: "ingressos", key: "ingressos", render: (_, r) => r.ingressos?.length || 0 },
    { title: "Participantes", dataIndex: "participantes", key: "participantes", render: (_, r) => r.participantes?.length || 0 },
  ];

  if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card title="Total de Eventos" bordered={false}>
            <h1>{summary.totalEventos}</h1>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="Total de Participantes" bordered={false}>
            <h1>{summary.totalParticipantes}</h1>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="Total de Ingressos" bordered={false}>
            <h1>{summary.totalIngressos}</h1>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Participantes por Evento">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Ingressos por Evento">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingressos" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Últimos Eventos" style={{ marginTop: 24 }}>
        <Table columns={columns} dataSource={summary.eventos} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}
