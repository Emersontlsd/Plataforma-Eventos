import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../api/api";

const { Title } = Typography;

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Carregar lista de admins
  async function loadAdmins() {
    setLoading(true);
    try {
      const res = await api.get("/admins"); // vamos criar rota GET depois
      setAdmins(res.data);
    } catch (err) {
      message.error("Erro ao carregar administradores");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  // Criar novo admin
  async function handleSubmit(values) {
    try {
      setLoading(true);
      await api.post("/admins/criar", values);
      message.success("Administrador criado com sucesso");
      setModalOpen(false);
      form.resetFields();
      loadAdmins();
    } catch (err) {
      message.error(err.response?.data?.erro || "Erro ao criar administrador");
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { title: "Nome", dataIndex: "nome" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" }
  ];

  return (
    <Card>
      <Title level={3}>Administradores</Title>

      <div style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Novo Admin
        </Button>
      </div>

      <Table
        dataSource={admins}
        columns={columns}
        rowKey={r => r._id || r.id}
        loading={loading}
      />

      <Modal
        title="Cadastrar Administrador"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Senha" name="senha" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
