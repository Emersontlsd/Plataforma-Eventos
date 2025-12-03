import api from "../api/api";

export default {
  async findAll() { return await apiFetch("/ingressos"); },
  async buy(eventId) { return await apiFetch("/ingressos/comprar", { method: "POST", body: JSON.stringify({ evento: eventId }) }); },
  async delete(id) { return await apiFetch(`/ingressos/${id}`, { method: "DELETE" }); }
};
