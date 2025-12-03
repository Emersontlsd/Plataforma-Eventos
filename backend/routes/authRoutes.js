import express from "express";
import controller from "../controllers/authController.js";

const r = express.Router();

r.post("/registrar", controller.registrar);
r.post("/login", controller.login);

export default r;
