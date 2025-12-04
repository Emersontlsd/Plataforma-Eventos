import api from "../api/api";

export default {
  async findAll() {
    const res = await api.get("/eventos");
    return res.data || [];
  },

  async findById(id) {
    const res = await api.get(`/eventos/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post("/eventos", data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/eventos/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/eventos/${id}`);
    return res.data;
  }
};
