// src/components/ParticipantsModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Button, message, Input, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import participantDAO from "../dao/participantDAO"; // DAO para manipular participantes
import eventDAO from "../dao/eventDAO"; // DAO para atualizar participantes no evento

export default function ParticipantsModal({ open, onClose, eventId, onSaved }) {
  const [participants, setParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

  async function loadParticipants() {
    if (!eventId) return;
    setLoading(true);
    try {
      // Carrega participantes já atribuídos ao evento
      const ev = await eventDAO.findById(eventId);
      setParticipants(ev.participantes || []);

      // Carrega todos participantes disponíveis
      const p = await participantDAO.findAll();
      setAllParticipants(p || []);
    } catch (err) {
      console.error(err);
      message.error("Erro ao carregar participantes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadParticipants();
      // foco no input quando o modal abre
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, eventId]);

  async function addParticipant(p) {
    try {
      await eventDAO.addParticipant(eventId, p._id || p.id);
      message.success("Participante adicionado");
      loadParticipants();
      onSaved?.();
    } catch (err) {
      console.error(err);
      message.error("Erro ao adicionar participante");
    }
  }

  async function removeParticipant(p) {
    try {
      await eventDAO.removeParticipant(eventId, p._id || p.id);
      message.success("Participante removido");
      loadParticipants();
      onSaved?.();
    } catch (err) {
      console.error(err);
      message.error("Erro ao remover participante");
    }
  }

  const filteredAll = allParticipants.filter(
    (p) =>
      !participants.some((pp) => pp._id === p._id) &&
      p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const columnsAssigned = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Popconfirm
          title="Remover participante?"
          onConfirm={() => removeParticipant(record)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const columnsAvailable = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addParticipant(record)}
        >
          Adicionar
        </Button>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title="Participantes"
      onCancel={onClose}
      width={800}
      destroyOnClose
      footer={null}
    >
      <Input
        placeholder="Pesquisar participante..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={inputRef}
        style={{ marginBottom: 12 }}
      />

      <h3>Participantes atribuídos</h3>
      <Table
        dataSource={participants}
        columns={columnsAssigned}
        rowKey={(r) => r._id || r.id}
        pagination={{ pageSize: 5 }}
        loading={loading}
        style={{ marginBottom: 24 }}
      />

      <h3>Adicionar participantes</h3>
      <Table
        dataSource={filteredAll}
        columns={columnsAvailable}
        rowKey={(r) => r._id || r.id}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </Modal>
  );
}
