import mongoose from "mongoose";

const ParticipanteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
});

export default mongoose.model("Participante", ParticipanteSchema);
