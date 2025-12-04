import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useAuth } from "../auth/AuthContext";
import api from "../api/api";

const { Title } = Typography;

export default function Configuracoes() {
  const { user, setUser } = useAuth();

  async function onFinish(values) {
    try {
      const { data } = await api.put(`/auth/update/${user._id}`, values);

      // Atualiza contexto e localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      message.success("Informações atualizadas com sucesso!");
    } catch (err) {
      message.error(err.response?.data?.erro || "Erro ao atualizar dados");
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          Configurações da Conta
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            nome: user?.nome,
            email: user?.email,
          }}
        >
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Informe seu nome" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Informe seu email" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Nova senha" name="senha">
            <Input.Password size="large" placeholder="Digite uma nova senha (opcional)" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block>
            Salvar alterações
          </Button>
        </Form>
      </Card>
    </div>
  );
}

// 🔥 Estilos responsivos
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 12,
  },
};
