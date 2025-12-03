import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import api from "../api/api"; // axios com JWT

export default function Participantes() {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/participantes");
      setParticipants(res.data);
    } catch (err) {
      message.error("Erro ao carregar participantes");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      nascimento: record.nascimento ? dayjs(record.nascimento) : null,
    });
    setModalOpen(true);
  }

  async function onSubmit(values) {
    try {
      const payload = {
        ...values,
        nascimento: values.nascimento
          ? values.nascimento.toISOString()
          : null,
      };

      if (editing) {
        await api.put(`/participantes/${editing._id}`, payload);
        message.success("Participante atualizado!");
      } else {
        await api.post("/participantes", payload);
        message.success("Participante criado!");
      }

      setModalOpen(false);
      load();
    } catch (err) {
      message.error("Erro ao salvar participante");
    }
  }

  async function deleteParticipant(id) {
    try {
      await api.delete(`/participantes/${id}`);
      message.success("Participante removido!");
      load();
    } catch (err) {
      message.error("Erro ao remover");
    }
  }

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (t) => <b>{t}</b>,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
    },
    {
      title: "Nascimento",
      dataIndex: "nascimento",
      key: "nascimento",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12 }}>
          <Button type="link" onClick={() => openEdit(record)}>
            Editar
          </Button>

          <Popconfirm
            title="Deseja excluir?"
            okText="Sim"
            cancelText="Cancelar"
            onConfirm={() => deleteParticipant(record._id)}
          >
            <Button type="link" danger>
              Excluir
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "end" }}>
        <Button type="primary" onClick={openCreate}>
          Novo Participante
        </Button>
      </div>

      <Table
        dataSource={participants}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "Editar Participante" : "Novo Participante"}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, message: "Informe o e-mail" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item name="telefone" label="Telefone">
            <Input />
          </Form.Item>

          <Form.Item name="nascimento" label="Data de Nascimento">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
