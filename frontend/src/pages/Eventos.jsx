import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Space
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
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const ev = await eventDAO.findAll();
    setEvents(ev || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function onAdd() {
    setEdit(null);
    form.resetFields();
    setModalOpen(true);
  }

  function onEdit(r) {
    setEdit(r);
    form.setFieldsValue({
      ...r,
      data: r.data ? dayjs(r.data) : null
    });
    setModalOpen(true);
  }

  async function onSubmit(values) {
    const payload = {
      ...values,
      data: values.data ? values.data.toISOString() : null
    };

    try {
      if (edit) {
        await eventDAO.update(edit._id || edit.id, payload);
        message.success("Evento atualizado");
      } else {
        await eventDAO.create(payload);
        message.success("Evento criado");
      }
      setModalOpen(false);
      load();
    } catch (error) {
      message.error("Erro ao salvar evento");
    }
  }

  async function onDelete(r) {
    Modal.confirm({
      title: "Tem certeza que deseja excluir?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        await eventDAO.delete(r._id || r.id);
        message.success("Evento removido");
        load();
      }
    });
  }

  function manageParticipants(r) {
    setSelectedEventId(r._id || r.id);
    setParticipantsModalOpen(true);
  }

  const columns = [
    { title: "Nome", dataIndex: "nome" },
    { title: "Local", dataIndex: "local" },
    { title: "Capacidade", dataIndex: "capacidade" },
    {
      title: "Data",
      dataIndex: "data",
      render: d => (d ? dayjs(d).format("DD/MM/YYYY") : "")
    },
    {
      title: "Ações",
      render: (_, r) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(r)}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(r)}
          />

          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={() => manageParticipants(r)}
          />
        </Space>
      )
    }
  ];

  return (
    <BasePage title="Eventos">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <Input.Search
          placeholder="Pesquisar..."
          style={{ width: 300, maxWidth: "100%" }}
          onSearch={() => {}}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          Novo Evento
        </Button>
      </div>

      <Table
        dataSource={events}
        columns={columns}
        rowKey={r => r._id || r.id}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        title={edit ? "Editar Evento" : "Novo Evento"}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="nome"
            label="Nome do Evento"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="local"
            label="Local"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacidade"
            label="Capacidade"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="data"
            label="Data"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
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
