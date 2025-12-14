import React, { useEffect, useState } from "react";
import { Table, Tag, Modal, List, Button, message } from "antd";
import api from "../api/api";

export default function Relatorios() {
  const [eventos, setEventos] = useState([]);
  const [participantsModal, setParticipantsModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  async function load() {
    try {
      const res = await api.get("/relatorios/eventos");

      // 🔐 garante que é array
      setEventos(Array.isArray(res.data.eventos) ? res.data.eventos : []);

    } catch (err) {
      if (err.response?.status === 403) {
        message.error("Acesso restrito a administradores");
      } else {
        message.error("Erro ao carregar relatório");
      }
    }
  }

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: "Evento", dataIndex: "nome" },
    { title: "Local", dataIndex: "local" },
    {
      title: "Data",
      dataIndex: "data",
      render: d => new Date(d).toLocaleDateString("pt-BR")
    },
    {
      title: "Status",
      dataIndex: "status",
      render: s =>
        s === "futuro"
          ? <Tag color="green">Ainda vai acontecer</Tag>
          : <Tag color="red">Já aconteceu</Tag>
    },
    {
      title: "Total Ingressos",
      dataIndex: "totalIngressos",
      render: (_, r) => r.ingressos?.length || 0
    },
    {
      title: "Total Participantes",
      dataIndex: "totalParticipantes",
      render: (_, r) => r.participantes?.length || 0
    },
    {
      title: "Participantes",
      render: (_, r) => (
        <Button
          onClick={() => {
            setSelectedParticipants(r.participantes || []);
            setParticipantsModal(true);
          }}
        >
          Ver Participantes
        </Button>
      )
    }
  ];

  return (
    <div>
      <h2>Relatórios de Eventos</h2>

      <Table
        columns={columns}
        dataSource={eventos}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Participantes"
        open={participantsModal}
        onCancel={() => setParticipantsModal(false)}
        footer={null}
      >
        <List
          dataSource={selectedParticipants}
          renderItem={item => (
            <List.Item>
              <b>{item.nome}</b> — {item.email}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
