import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";
import participanteRoutes from "./routes/participanteRoutes.js";
import ingressoRoutes from "./routes/ingressoRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// conectar DB
connectDB();

app.use("/auth", authRoutes);
app.use("/eventos", eventoRoutes);
app.use("/participantes", participanteRoutes);
app.use("/ingressos", ingressoRoutes);
app.use("/relatorios", relatorioRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Backend rodando na porta ${process.env.PORT}`)
);
