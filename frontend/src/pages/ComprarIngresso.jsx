import React, { useEffect, useState } from "react";
import { Card, Button, List, message } from "antd";
import eventDAO from "../dao/eventDAO";
import ticketDAO from "../dao/ticketDAO";
import { useAuth } from "../auth/AuthContext";

export default function ComprarIngresso() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ev = await eventDAO.findAll();
      setEvents(ev || []);
      setLoading(false);
    }
    load();
  }, []);

  async function buy(id) {
    if (!user) return;
    const res = await ticketDAO.buy(id);
    if (res?._id || res?.id) {
      message.success("Ingresso comprado!");
    } else message.error(res?.message || "Erro");
  }

  return (
    <>
      <h2>Comprar Ingressos</h2>
      <List grid={{ gutter: 16, column: 3 }} dataSource={events} renderItem={e => (
        <List.Item key={e._id || e.id}>
          <Card title={e.nome}>
            <p>{new Date(e.data).toLocaleString()}</p>
            <p>Local: {e.local}</p>
            <Button type="primary" onClick={() => buy(e._id || e.id)}>Comprar</Button>
          </Card>
        </List.Item>
      )} />
    </>
  );
}
