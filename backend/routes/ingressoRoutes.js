import express from "express";
import controller from "../controllers/ingressoController.js";
import auth from "../middlewares/authMiddleware.js";

const r = express.Router();

r.get("/", auth, controller.listar);
r.post("/comprar", auth, controller.comprar);
r.delete("/:id", auth, controller.deletar);

export default r;
