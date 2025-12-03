import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import ticketDAO from "../dao/ticketDAO";

export default function Ingressos() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const t = await ticketDAO.findAll();
    setTickets(t || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function del(id) {
    Modal.confirm({
      title: "Remover ingresso?",
      onOk: async () => {
        await ticketDAO.delete(id);
        message.success("Removido");
        load();
      }
    });
  }

  const columns = [
    { title: "Evento", dataIndex: ["evento","nome"], render: (v, r) => r.evento?.nome || "" },
    { title: "Usuário", dataIndex: ["usuario","email"], render: (v, r) => r.usuario?.email || "" },
    { title: "Data", dataIndex: "dataCompra", render: d => new Date(d).toLocaleString() },
    { title: "Ações", render: (_, r) => <Button danger onClick={() => del(r._id || r.id)}>Remover</Button> }
  ];

  return (
    <>
      <h2>Ingressos</h2>
      <Table dataSource={tickets} columns={columns} loading={loading} rowKey={r=>r._id||r.id} />
    </>
  );
}
