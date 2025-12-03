import Participante from "../models/Participante.js";

export default {
  async listar(req, res) {
    res.json(await Participante.find());
  },

  async criar(req, res) {
    res.json(await Participante.create(req.body));
  },

  async atualizar(req, res) {
    res.json(
      await Participante.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  },

  async deletar(req, res) {
    await Participante.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  },
};
