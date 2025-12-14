import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Card, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

const { Title } = Typography;

export default function Configuracoes() {
  const { user, updateUserLocal } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || ""
      });
      if (user.avatar?.url) {
        setFileList([{
          uid: "-1",
          name: "avatar",
          status: "done",
          url: user.avatar.url
        }]);
      }
    }
  }, [user]);

  async function handleUpdate(values) {
    try {
      setLoading(true);

      // Atualiza nome, telefone e senha
      const res = await api.put(`/usuarios/${user.id}`, values);
      let updatedUser = res.data;

      // Atualiza foto
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("imagem", fileList[0].originFileObj);
        const fotoRes = await api.post(`/usuarios/imagem/${user.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        updatedUser = fotoRes.data;
      }

      message.success("Dados atualizados com sucesso!");
      updateUserLocal(updatedUser);

    } catch (err) {
      console.error(err);
      message.error("Erro ao atualizar dados");
    } finally {
      setLoading(false);
    }
  }

  const uploadProps = {
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    onRemove: () => setFileList([]),
    fileList
  };

  return (
    <Card style={{ maxWidth: 500, margin: "20px auto" }}>
      <Title level={3}>Configurações do Usuário</Title>

      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="E-mail" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Telefone" name="telefone">
          <Input />
        </Form.Item>

        <Form.Item label="Senha" name="senha">
          <Input.Password placeholder="Deixe em branco para não alterar" />
        </Form.Item>

        <Form.Item label="Foto de Perfil">
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Selecionar imagem</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Salvar Alterações
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
