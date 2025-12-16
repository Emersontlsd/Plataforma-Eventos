import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, List, Button, message } from "antd";
import api from "../api/api";
import dayjs from "dayjs";

export default function EventoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadEvento() {
    try {
      setLoading(true);
      const { data } = await api.get(`/eventos/${id}`);
      setEvento(data);
    } catch (err) {
      message.error("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvento();
  }, [id]);

  if (!evento) return null;

  return (
    <div>
      <h2>{evento.nome}</h2>

      <Card title="Informações do Evento" style={{ marginBottom: 24 }}>
        <p><b>Local:</b> {evento.local}</p>

        <p>
          <b>Data:</b>{" "}
          {evento.data
            ? dayjs(evento.data).format("DD/MM/YYYY")
            : "—"}
        </p>

        <p>
          <b>Total de Ingressos:</b>{" "}
          {evento.totalIngressos ?? 0}
        </p>
      </Card>

      <Card title="Participantes" style={{ marginBottom: 24 }}>
        <List
          dataSource={evento.participantes || []}
          locale={{ emptyText: "Nenhum participante" }}
          renderItem={(p) => (
            <List.Item>
              {p.nome} — {p.email}
            </List.Item>
          )}
        />
      </Card>

      <Button
        type="primary"
        onClick={() => navigate(`/eventos/editar/${evento._id}`)}
      >
        Editar Evento
      </Button>
    </div>
  );
}
