'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Target, Calculator, SlidersHorizontal, Radar, User, LogIn } from 'lucide-react';

export default function Navegacao() {
  const pathname = usePathname();
  const { usuario } = useAuth();

  const navItems = [
    { href: '/', label: 'Radar Ativo', icon: Radar },
    { href: '/simulador', label: 'Simulador ROI', icon: Calculator },
    { href: '/preferencias', label: 'Antispam', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80 shadow-glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all">
            <Target className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-slate-100 font-sans">
                SNIPER <span className="text-emerald-400">OFERTAS</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PWA v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Radar de Consumo Inteligente</p>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Perfil do Usuário & Badge Online */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold font-mono">
              {usuario ? usuario.nome.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden sm:inline-block">
              {usuario ? usuario.nome.split(' ')[0] : 'Entrar'}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Navegação Mobile Inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800 px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-all py-1 px-2 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400 drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/login"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-all py-1 px-2 ${
              pathname === '/login' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-5 h-5 ${pathname === '/login' ? 'scale-110 text-emerald-400' : ''}`} />
            <span>{usuario ? usuario.nome.split(' ')[0] : 'Perfil'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
