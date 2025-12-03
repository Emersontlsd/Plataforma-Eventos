import api from "../api/api";

export default {
  async findAll() { return await apiFetch("/participantes"); },
  async create(data) { return await apiFetch("/participantes", { method: "POST", body: JSON.stringify(data) }); },
  async update(id, data) { return await apiFetch(`/participantes/${id}`, { method: "PUT", body: JSON.stringify(data) }); },
  async delete(id) { return await apiFetch(`/participantes/${id}`, { method: "DELETE" }); }
};
