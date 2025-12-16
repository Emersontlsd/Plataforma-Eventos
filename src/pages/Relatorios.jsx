import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Modal,
  List,
  Button,
  message,
  DatePicker,
  Select,
  Space
} from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function Relatorios() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [participantsModal, setParticipantsModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [periodo, setPeriodo] = useState(null);
  const [status, setStatus] = useState("todos");

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/relatorios/eventos");
      setData(res.data || []);
      setFiltered(res.data || []);
    } catch {
      message.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // 🔍 FILTROS
  useEffect(() => {
    let result = [...data];

    if (periodo) {
      const [start, end] = periodo;
      result = result.filter(ev => {
        const d = dayjs(ev.data);
        return d.isAfter(start.startOf("day")) && d.isBefore(end.endOf("day"));
      });
    }

    if (status !== "todos") {
      result = result.filter(ev => {
        const isFuture = dayjs(ev.data).isAfter(dayjs());
        return status === "futuros" ? isFuture : !isFuture;
      });
    }

    setFiltered(result);
  }, [periodo, status, data]);

  const columns = [
    { title: "Evento", dataIndex: "nome" },
    { title: "Local", dataIndex: "local" },
    {
      title: "Data",
      dataIndex: "data",
      render: d => dayjs(d).format("DD/MM/YYYY")
    },
    {
      title: "Status",
      render: (_, r) =>
        dayjs(r.data).isAfter(dayjs()) ? (
          <Tag color="green">Futuro</Tag>
        ) : (
          <Tag color="red">Encerrado</Tag>
        )
    },
    { title: "Ingressos", dataIndex: "totalIngressos" },
    { title: "Participantes", dataIndex: "totalParticipantes" },
    {
      title: "Ações",
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedParticipants(r.participantes || []);
              setParticipantsModal(true);
            }}
          >
            Participantes
          </Button>

          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/eventos?eventoId=${r._id}`)}
          >
            Abrir Evento
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2>Relatórios de Eventos</h2>

      {/* 🔍 FILTROS */}
      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker
          onChange={setPeriodo}
          format="DD/MM/YYYY"
        />

        <Select
          value={status}
          onChange={setStatus}
          style={{ width: 200 }}
          options={[
            { value: "todos", label: "Todos os eventos" },
            { value: "futuros", label: "Eventos futuros" },
            { value: "encerrados", label: "Eventos encerrados" }
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 👥 MODAL PARTICIPANTES */}
      <Modal
        title="Participantes do Evento"
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
