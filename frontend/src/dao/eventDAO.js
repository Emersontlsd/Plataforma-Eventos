import api from "../api/api";

export default {
  async findAll() { return await apiFetch("/eventos"); },
  async findById(id) { return await apiFetch(`/eventos/${id}`); },
  async create(data) { return await apiFetch("/eventos", { method: "POST", body: JSON.stringify(data) }); },
  async update(id, data) { return await apiFetch(`/eventos/${id}`, { method: "PUT", body: JSON.stringify(data) }); },
  async delete(id) { return await apiFetch(`/eventos/${id}`, { method: "DELETE" }); }
};
