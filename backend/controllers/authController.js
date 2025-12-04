import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  // Registrar usuário
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Preencha todos os campos" });
      }

      // Verifica email
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ erro: "E-mail já cadastrado" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(senha, salt);

      const user = await User.create({ nome, email, senha: hashed });

      return res.json({
        mensagem: "Usuário registrado com sucesso",
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("Erro no registro:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  // Login do usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ erro: "Usuário não existe" });
      }

      const valid = bcrypt.compareSync(senha, user.senha);
      if (!valid) {
        return res.status(400).json({ erro: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "SEGREDOAQUI",
        { expiresIn: "2d" }
      );

      return res.json({
        mensagem: "Login realizado",
        token,
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        }
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  // Atualizar dados
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Verifica email duplicado
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ erro: "E-mail já está em uso" });
        }
      }

      if (nome) user.nome = nome;
      if (email) user.email = email;

      if (senha) {
        const salt = bcrypt.genSaltSync(10);
        user.senha = bcrypt.hashSync(senha, salt);
      }

      await user.save();

      const userData = user.toObject();
      delete userData.senha;

      return res.json(userData);

    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
};
