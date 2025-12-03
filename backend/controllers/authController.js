import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  async registrar(req, res) {
    try {
      const { nome, email, senha, role } = req.body;

      const hash = bcrypt.hashSync(senha, 10);

      const usuario = await User.create({
        nome,
        email,
        senha: hash,
        role: role || "user",
      });

      res.json(usuario);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ erro: "Usuário não existe" });

    if (!bcrypt.compareSync(senha, user.senha))
      return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  },
};
