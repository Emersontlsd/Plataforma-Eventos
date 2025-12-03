import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
   const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogin(values) {
    setLoading(true);
    await login(values.email, values.senha);
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">Entrar</Title>

        <Form layout="vertical" onFinish={handleLogin}>
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
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Logar
          </Button>
        </Form>

        <div className="auth-footer">
          <Text strong onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
            Cadastre-se
          </Text>
        </div>
      </Card>
    </div>
  );
}
