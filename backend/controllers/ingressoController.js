import Ingresso from "../models/Ingresso.js";

export default {
  async listar(req, res) {
    res.json(await Ingresso.find().populate("evento usuario"));
  },

  async comprar(req, res) {
    const novo = await Ingresso.create({
      evento: req.body.evento,
      usuario: req.user.id,
    });

    res.json(novo);
  },

  async deletar(req, res) {
    await Ingresso.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  },
};
