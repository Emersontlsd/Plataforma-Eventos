export function onlyAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem acessar." });
    }

    next();
  } catch (err) {
    console.error("Erro no onlyAdmin:", err);
    res.status(500).json({ error: "Erro interno no middleware de permissão." });
  }
}
