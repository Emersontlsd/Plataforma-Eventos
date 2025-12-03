import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  data: String,
  local: String,
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participante" }]
});

export default mongoose.model("Evento", EventoSchema);
