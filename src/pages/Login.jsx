import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogin(values) {
    try {
      setLoading(true);

      // 🔐 envia email + password (contrato correto com o backend)
      await login(values.email, values.password);

      message.success("Login realizado com sucesso!");
      navigate("/"); // ajuste se sua rota inicial for outra
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "E-mail ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">
          Entrar
        </Title>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          requiredMark={false}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Informe seu e-mail" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input size="large" placeholder="seu@email.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Informe sua senha" }]}
          >
            <Input.Password size="large" placeholder="********" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Entrar
          </Button>
        </Form>

        <div className="auth-footer" style={{ marginTop: 16 }}>
          <Text>
            Não tem conta?{" "}
            <Text
              strong
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer" }}
            >
              Cadastre-se
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
}
