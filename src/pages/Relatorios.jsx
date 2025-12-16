import React, { useEffect, useState } from "react";
import { Table, Tag, Modal, List, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import dayjs from "dayjs";

const { Option } = Select;

export default function Relatorios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");

  const [participantsModal, setParticipantsModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/relatorios/eventos");
      setData(res.data.eventos || []);
    } catch {
      message.error("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredData = data.filter(e =>
    statusFilter === "todos" ? true : e.status === statusFilter
  );

  const columns = [
    {
      title: "Evento",
      dataIndex: "nome",
    },
    {
      title: "Local",
      dataIndex: "local",
    },
    {
      title: "Data",
      dataIndex: "data",
      render: d => d ? dayjs(d).format("DD/MM/YYYY") : "-"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: s =>
        s === "futuro"
          ? <Tag color="green">Futuro</Tag>
          : <Tag color="red">Encerrado</Tag>
    },
    {
      title: "Ingressos",
      dataIndex: "totalIngressos",
    },
    {
      title: "Participantes",
      dataIndex: "totalParticipantes",
    },
    {
      title: "Ações",
      render: (_, r) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setSelectedParticipants(r.participantes || []);
              setParticipantsModal(true);
            }}
          >
            Ver Participantes
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/eventos/${r._id}`)}
          >
            Abrir Evento
          </Button>
        </>
      )
    }
  ];

  return (
    <div>
      <h2>Relatórios de Eventos</h2>

      <div style={{ marginBottom: 16 }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 220 }}
        >
          <Option value="todos">Todos</Option>
          <Option value="futuro">Eventos Futuros</Option>
          <Option value="passado">Eventos Encerrados</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Participantes do Evento"
        open={participantsModal}
        onCancel={() => setParticipantsModal(false)}
        footer={null}
      >
        <List
          dataSource={selectedParticipants}
          locale={{ emptyText: "Nenhum participante" }}
          renderItem={p => (
            <List.Item>
              <b>{p?.nome}</b> — {p?.email}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
