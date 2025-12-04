import Evento from "../models/Evento.js";

export default {
  async listar(req, res) {
    const eventos = await Evento.find().populate("participantes");
    res.json(eventos);
  },

  async criar(req, res) {
    const novo = await Evento.create({
      nome: req.body.nome,
      descricao: req.body.descricao,
      data: req.body.data,
      local: req.body.local,
      capacidade: req.body.capacidade
    });
    res.json(novo);
  },

  async atualizar(req, res) {
    const atualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        descricao: req.body.descricao,
        data: req.body.data,
        local: req.body.local,
        capacidade: req.body.capacidade
      },
      { new: true }
    );
    res.json(atualizado);
  },

  async deletar(req, res) {
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  },
};
