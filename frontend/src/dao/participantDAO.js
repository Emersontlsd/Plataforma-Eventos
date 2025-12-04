import api from "../api/api";

export default {
  async findAll() {
    const res = await api.get("/participantes");
    return res.data || [];
  },

  async findById(id) {
    const res = await api.get(`/participantes/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post("/participantes", data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/participantes/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/participantes/${id}`);
    return res.data;
  }
};
