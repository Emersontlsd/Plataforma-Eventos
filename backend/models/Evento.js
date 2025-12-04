import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
  nome: { type: String, required: true },         // antes: titulo
  descricao: { type: String },
  data: { type: Date, required: true },
  local: { type: String },
  capacidade: { type: Number, required: true },   // campo novo
  participantes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Participante" }
  ]
}, { timestamps: true });

export default mongoose.model("Evento", EventoSchema);
