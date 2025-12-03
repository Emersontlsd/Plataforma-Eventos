import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import participantDAO from "../dao/participantDAO";
import eventDAO from "../dao/eventDAO";

export default function ParticipantsModal({ open, onClose, eventId, onSaved }) {
  const [available, setAvailable] = useState([]);
  const [linked, setLinked] = useState([]);
  const [selAvail, setSelAvail] = useState([]);
  const [selLinked, setSelLinked] = useState([]);

  useEffect(() => {
    async function load() {
      if (!open) return;
      const all = await participantDAO.findAll();
      const ev = await eventDAO.findById(eventId);
      const linkedIds = ev.participantes || [];
      setAvailable(all.filter(p => !linkedIds.includes(p.id)));
      setLinked(all.filter(p => linkedIds.includes(p.id)));
      setSelAvail([]); setSelLinked([]);
    }
    load();
  }, [open]);

  async function save() {
    const ids = linked.map(p => p.id);
    await eventDAO.update(eventId, { participantes: ids });
    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onCancel={onClose} onOk={save} width={700} title="Gerenciar Participantes">
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h4>Disponíveis</h4>
          <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #eee", padding: 8 }}>
            {available.map(p => (
              <div key={p.id}>
                <label>
                  <input type="checkbox" checked={selAvail.includes(p.id)} onChange={() => {
                    setSelAvail(s => s.includes(p.id) ? s.filter(x=>x!==p.id) : [...s, p.id]);
                  }} /> {p.nome} — {p.email}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <Button onClick={() => {
            const toAdd = available.filter(p => selAvail.includes(p.id));
            setLinked(l => [...l, ...toAdd]);
            setAvailable(a => a.filter(p => !selAvail.includes(p.id)));
            setSelAvail([]);
          }}>{">>"}</Button>
          <Button danger onClick={() => {
            const toRem = linked.filter(p => selLinked.includes(p.id));
            setAvailable(a => [...a, ...toRem]);
            setLinked(l => l.filter(p => !selLinked.includes(p.id)));
            setSelLinked([]);
          }}>{"<<"}</Button>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Vinculados</h4>
          <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #eee", padding: 8 }}>
            {linked.map(p => (
              <div key={p.id}>
                <label>
                  <input type="checkbox" checked={selLinked.includes(p.id)} onChange={() => {
                    setSelLinked(s => s.includes(p.id) ? s.filter(x=>x!==p.id) : [...s, p.id]);
                  }} /> {p.nome} — {p.email}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
