'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UsuarioSession {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: UsuarioSession | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Carregar sessão salva do localStorage no carregamento inicial
    const sessionSalva = localStorage.getItem('sniper_user_session');
    if (sessionSalva) {
      try {
        setUsuario(JSON.parse(sessionSalva));
      } catch (e) {}
    } else {
      // Usuário Demo padrão
      const userDemo = { id: 1, nome: 'Vinicius (Sniper Demo)', email: 'vinicius@sniper.com' };
      setUsuario(userDemo);
      localStorage.setItem('sniper_user_session', JSON.stringify(userDemo));
    }
    setLoading(false);
  }, []);

  const salvarSessao = (user: UsuarioSession | null) => {
    setUsuario(user);
    if (user) {
      localStorage.setItem('sniper_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('sniper_user_session');
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (data.success && data.usuario) {
        salvarSessao(data.usuario);
        return { success: true };
      }
      return { success: false, error: data.error || 'Credenciais inválidas' };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const cadastrar = async (nome: string, email: string, senha: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();
      if (data.success && data.usuario) {
        salvarSessao(data.usuario);
        return { success: true };
      }
      return { success: false, error: data.error || 'Erro ao cadastrar usuário' };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = () => {
    salvarSessao(null);
  };

  const loginDemo = () => {
    const userDemo = { id: 1, nome: 'Vinicius (Sniper Demo)', email: 'vinicius@sniper.com' };
    salvarSessao(userDemo);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, cadastrar, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
