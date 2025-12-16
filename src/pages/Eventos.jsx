import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import eventDAO from "../dao/eventDAO";
import ParticipantsModal from "../components/ParticipantsModal";
import BasePage from "../components/BasePage";

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  // Carregar eventos
  async function load() {
    setLoading(true);
    try {
      const ev = await eventDAO.findAll();
      const normalized = (ev || []).map(e => ({
        ...e,
        ingressos: Array.isArray(e.ingressos) ? e.ingressos : [],
        participantes: Array.isArray(e.participantes) ? e.participantes : []
      }));
      setEvents(normalized);
    } catch (err) {
      console.error(err);
      message.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Novo evento
  function onAdd() {
    setEdit(null);
    form.resetFields();
    setModalOpen(true);
  }

  // Editar evento
  function onEdit(r) {
    setEdit(r);
    form.setFieldsValue({
      nome: r.nome,
      local: r.local,
      capacidade: r.capacidade,
      data: r.data ? dayjs(r.data) : null
    });
    setModalOpen(true);
  }

  // Salvar (criar / editar)
  async function onSubmit(values) {
    const payload = {
      ...values,
      data: values.data ? values.data.toISOString() : null
    };

    try {
      if (edit) {
        await eventDAO.update(edit._id || edit.id, payload);
        message.success("Evento atualizado com sucesso");
      } else {
        await eventDAO.create(payload);
        message.success("Evento criado com sucesso");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      console.error(err);
      message.error("Erro ao salvar evento");
    }
  }

  // Deletar
  async function onDelete(r) {
    Modal.confirm({
      title: "Deseja realmente excluir este evento?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await eventDAO.delete(r._id || r.id);
          message.success("Evento removido");
          load();
        } catch (err) {
          console.error(err);
          message.error("Erro ao remover evento");
        }
      }
    });
  }

  // Participantes
  function manageParticipants(r) {
    setSelectedEventId(r._id || r.id);
    setParticipantsModalOpen(true);
  }

  // Filtro
  const filteredEvents = useMemo(() => {
    if (!search) return events;
    const s = search.toLowerCase();
    return events.filter(e =>
      e.nome?.toLowerCase().includes(s) ||
      e.local?.toLowerCase().includes(s) ||
      (e.data && dayjs(e.data).format("DD/MM/YYYY").includes(s)) ||
      String(e.capacidade).includes(s)
    );
  }, [events, search]);

  // Colunas
  const columns = [
    { title: "Nome", dataIndex: "nome" },
    { title: "Local", dataIndex: "local" },
    { title: "Capacidade", dataIndex: "capacidade" },
    {
      title: "Data",
      dataIndex: "data",
      render: d => (d ? dayjs(d).format("DD/MM/YYYY") : "-")
    },
    {
      title: "Participantes",
      render: (_, r) => r.participantes.length
    },
    {
      title: "Ingressos",
      render: (_, r) => r.ingressos.length
    },
    {
      title: "Ações",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 12 }}>
          <EditOutlined onClick={() => onEdit(r)} style={{ color: "#1677ff" }} />
          <DeleteOutlined onClick={() => onDelete(r)} style={{ color: "red" }} />
          <TeamOutlined onClick={() => manageParticipants(r)} style={{ color: "#52c41a" }} />
        </div>
      )
    }
  ];

  return (
    <BasePage title="Eventos">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Input.Search
          placeholder="Pesquisar eventos"
          allowClear
          style={{ width: 300 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Novo Evento
        </Button>
      </div>

      <Table
        dataSource={filteredEvents}
        columns={columns}
        rowKey={r => r._id || r.id}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        title={edit ? "Editar Evento" : "Novo Evento"}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="local" label="Local" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="capacidade" label="Capacidade" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="data" label="Data" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <ParticipantsModal
        open={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        eventId={selectedEventId}
        onSaved={load}
      />
    </BasePage>
  );
}
