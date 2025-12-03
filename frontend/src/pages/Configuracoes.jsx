import React from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../auth/AuthContext";

export default function Configuracoes() {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();

  function onFinish(values) {
    // opcional: PUT /users/:id para salvar
    message.success("Salvo (implemente backend)");
    setUser(prev => ({ ...prev, nome: values.nome || prev.nome }));
  }

  return (
    <>
      <h2>Configurações</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ nome: user?.nome, email: user?.email }}>
        <Form.Item name="nome" label="Nome"><Input/></Form.Item>
        <Form.Item name="email" label="Email"><Input disabled/></Form.Item>
        <Form.Item name="senha" label="Nova senha"><Input.Password/></Form.Item>
        <Form.Item><Button type="primary" htmlType="submit">Salvar</Button></Form.Item>
      </Form>
    </>
  );
}
