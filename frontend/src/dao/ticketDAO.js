import api from "../api/api";

export default {
  async findAll() {
    const res = await api.get("/ingressos");
    return res.data || [];
  },

  async buy(eventId) {
    const res = await api.post("/ingressos/comprar", {
      evento: eventId
    });
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/ingressos/${id}`);
    return res.data;
  }
};
