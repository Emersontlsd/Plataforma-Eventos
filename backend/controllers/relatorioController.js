import Ingresso from "../models/Ingresso.js";
import Evento from "../models/Evento.js";

export default {
  async geral(req, res) {
    const totalEventos = await Evento.countDocuments();
    const totalIngressos = await Ingresso.countDocuments();

    res.json({ totalEventos, totalIngressos });
  },
};
