'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Target, Lock, Mail, User, ArrowRight, Sparkles, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { usuario, login, cadastrar, logout, loginDemo } = useAuth();

  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (modo === 'login') {
      const res = await login(email, senha);
      if (res.success) {
        router.push('/');
      } else {
        setErro(res.error || 'Falha ao autenticar.');
      }
    } else {
      const res = await cadastrar(nome, email, senha);
      if (res.success) {
        router.push('/');
      } else {
        setErro(res.error || 'Falha ao criar conta.');
      }
    }
    setCarregando(false);
  };

  const handleEntrarDemo = () => {
    loginDemo();
    router.push('/');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(57,255,20,0.2)] text-slate-100 relative overflow-hidden"
      >
        {/* Glow Radar de Fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Marca & Logo */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/50 mb-3 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <Target className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
            SNIPER <span className="text-emerald-400">OFERTAS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Identificação de Usuário & Controle de Radar Personalizado</p>
        </div>

        {/* Se já estiver logado */}
        {usuario ? (
          <div className="space-y-6 relative z-10 text-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-lg font-bold font-mono">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-mono block">SESSÃO ATIVA</span>
              <h3 className="text-lg font-bold text-slate-100">{usuario.nome}</h3>
              <p className="text-xs text-slate-400">{usuario.email}</p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all"
              >
                Acessar Meu Radar <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" /> Encerrar Sessão / Trocar Conta
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Alternador de Abas: Login / Cadastro */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6 relative z-10">
              <button
                onClick={() => { setModo('login'); setErro(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  modo === 'login'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Entrar na Conta
              </button>
              <button
                onClick={() => { setModo('cadastro'); setErro(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  modo === 'cadastro'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs text-center">
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {modo === 'cadastro' && (
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Vinicius Silva"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50 transition-all mt-2"
              >
                {carregando ? 'Autenticando...' : modo === 'login' ? 'Entrar no Meu Radar' : 'Criar Conta Sniper'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase">
                Acesso Rápido de Teste
              </span>
            </div>

            {/* Botão Entrar como Demo */}
            <button
              onClick={handleEntrarDemo}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4" /> Entrar com Usuário de Demonstração (Vinicius)
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
