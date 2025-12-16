import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import dayjs from "dayjs";
import api from "../services/api";

export default function EditarEvento({ evento, onClose, onUpdated }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (evento) {
      form.setFieldsValue({
        nome: evento.nome,
        local: evento.local,
        data: evento.data ? dayjs(evento.data) : null,
      });
    }
  }, [evento, form]);

  const onFinish = async (values) => {
    try {
      await api.put(`/eventos/${evento._id}`, {
        ...values,
        data: values.data.format("YYYY-MM-DD"),
      });

      message.success("Evento atualizado com sucesso!");
      onUpdated();
      onClose();
    } catch (err) {
      message.error("Erro ao atualizar evento");
    }
  };

  if (!evento) return null;

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        name="nome"
        label="Nome do evento"
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
        name="data"
        label="Data"
        rules={[{ required: true }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Salvar alterações
      </Button>
    </Form>
  );
}
