import React, { useEffect, useState } from "react";
import { Table, Tag, Modal, List, Button, message } from "antd";
import api from "../api/api";
import dayjs from "dayjs";

export default function Relatorios() {
  const [data, setData] = useState([]);
  const [participantsModal, setParticipantsModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados do relatório
  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/relatorios/eventos");
      setData(res.data.eventos || []);
      setLoading(false);
    } catch (err) {
      message.error("Erro ao carregar relatórios");
      setLoading(false);
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
      render: d => d ? dayjs(d).format("DD/MM/YYYY") : ""
    },
    {
      title: "Status",
      dataIndex: "data",
      render: d =>
        d && new Date(d) > new Date() ? (
          <Tag color="green">Ainda vai acontecer</Tag>
        ) : (
          <Tag color="red">Já aconteceu</Tag>
        )
    },
    { title: "Total Ingressos", dataIndex: "totalIngressos" },
    { title: "Total Participantes", dataIndex: "totalParticipantes" },
    {
      title: "Participantes",
      render: (_, r) => (
        <Button
          type="primary"
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
        dataSource={data}
        rowKey={r => r._id || r.id}
        loading={loading}
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
