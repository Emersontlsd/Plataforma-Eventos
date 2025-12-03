import mongoose from "mongoose";

const IngressoSchema = new mongoose.Schema({
  evento: { type: mongoose.Schema.Types.ObjectId, ref: "Evento" },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  compradoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Ingresso", IngressoSchema);
