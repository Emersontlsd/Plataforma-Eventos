import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import eventDAO from "../dao/eventDAO";
import participantDAO from "../dao/participantDAO";
import ticketDAO from "../dao/ticketDAO";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);

  useEffect(() => {
    async function load() {
      const ev = await eventDAO.findAll();
      setEvents(ev || []);
      const ps = await participantDAO.findAll();
      setParticipantsCount((ps || []).length);
      const ts = await ticketDAO.findAll();
      setTicketsCount((ts || []).length);
    }
    load();
  }, []);

  return (
    <>
      <h2>Dashboard</h2>
      <Row gutter={[16,16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Eventos" value={events.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Participantes" value={participantsCount} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Ingressos" value={ticketsCount} />
          </Card>
        </Col>
      </Row>
      {/* Lista de eventos resumida */}
      <div style={{ marginTop: 16 }}>
        <h3>Próximos eventos</h3>
        <Row gutter={[12,12]}>
          {events.slice(0,6).map(ev => (
            <Col xs={24} sm={12} md={8} key={ev._id || ev.id}>
              <Card title={ev.nome}>{new Date(ev.data).toLocaleDateString()}</Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
