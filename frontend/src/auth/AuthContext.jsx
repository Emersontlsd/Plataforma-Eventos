import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      // opcional: validar token buscando /auth/me (se implementar)
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
      } catch {}
    }
  }, []);

  async function login(email, senha) {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    if (res?.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return { ok: true };
    }
    return { ok: false, message: res?.message || "Erro ao logar" };
  }

  async function register(payload) {
    // registra como 'pending' no backend — backend deve salvar status pending
    const res = await api("/auth/registrar", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
