import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import api from "../api/api";

export default function Relatorios() {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function load() {
      const res = await api("/relatorios");
      setData(res);
    }
    load();
  }, []);

  return (
    <>
      <h2>Relatórios</h2>
      <Row gutter={16}>
        <Col span={8}><Card title="Total Eventos">{data?.totalEventos ?? "-"}</Card></Col>
        <Col span={8}><Card title="Total Ingressos">{data?.totalIngressos ?? "-"}</Card></Col>
        <Col span={8}><Card title="Observações">Use filtros avançados no backend</Card></Col>
      </Row>
    </>
  );
}
