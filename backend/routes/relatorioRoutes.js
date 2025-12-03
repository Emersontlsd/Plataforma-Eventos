import express from "express";
import controller from "../controllers/relatorioController.js";
import auth from "../middlewares/authMiddleware.js";
import { onlyAdmin } from "../middlewares/roleMiddleware.js";

const r = express.Router();

r.get("/", auth, onlyAdmin, controller.geral);

export default r;
