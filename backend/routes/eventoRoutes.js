import express from "express";
import controller from "../controllers/eventoController.js";
import auth from "../middlewares/authMiddleware.js";
import { onlyAdmin } from "../middlewares/roleMiddleware.js";

const r = express.Router();

r.get("/", auth, controller.listar);
r.post("/", auth, onlyAdmin, controller.criar);
r.put("/:id", auth, onlyAdmin, controller.atualizar);
r.delete("/:id", auth, onlyAdmin, controller.deletar);

export default r;
