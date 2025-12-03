import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import api from "../api/api";
import { useNavigate } from "react-router-dom";


const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(values) {
    setLoading(true);

    await api.post("/auth/register", values);

    setLoading(false);
    window.location.href = "/login";
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">
          Criar Conta
        </Title>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Nome Completo"
            name="nome"
            rules={[{ required: true, message: "Informe seu nome" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Informe seu e-mail" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[{ required: true, message: "Informe sua senha" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={loading}
          >
            Criar Conta
          </Button>
        </Form>

        <div className="auth-footer">
          <Text
            strong
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Já tenho uma conta
          </Text>
        </div>
      </Card>
    </div>
  );
}
