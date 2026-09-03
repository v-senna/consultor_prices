'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, Clock, Zap, ExternalLink, Copy, Check, Tag } from 'lucide-react';
import { OfertaCronograma } from '@/types';

interface RadarAtivoProps {
  ofertas: OfertaCronograma[];
  categoriasFocadas: string[];
}

export default function RadarAtivo({ ofertas, categoriasFocadas }: RadarAtivoProps) {
  const [horaAtual, setHoraAtual] = useState<string>('');
  const [diaSemanaNome, setDiaSemanaNome] = useState<string>('');
  const [copiadoId, setCopiadoId] = useState<number | null>(null);

  useEffect(() => {
    const atualizarHorario = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      setDiaSemanaNome(dias[agora.getDay()]);
    };

    atualizarHorario();
    const interval = setInterval(atualizarHorario, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar ofertas que combinam com as categorias de foco
  const ofertasRelevantes = ofertas.filter(o => 
    categoriasFocadas.some(cat => 
      o.categoria.toLowerCase().includes(cat.toLowerCase()) || 
      cat.toLowerCase().includes(o.categoria.toLowerCase())
    )
  );

  // Ofertas atualmente em horário de gatilho ativo
  const ofertasAtivasHoje = ofertasRelevantes.filter(o => o.ativo_agora);
  const ofertaDestaque = ofertasAtivasHoje.length > 0 ? ofertasAtivasHoje[0] : ofertasRelevantes[0];

  const handleCopiar = (id: number, codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <div className="w-full mb-8">
      {/* Banner Principal de Status do Radar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(57,255,20,0.15)] backdrop-blur-xl"
      >
        {/* Glow Radar de Fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Linha de Horário em Tempo Real */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Radar className="w-5 h-5 animate-spin-radar" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                VARREDURA DE CONSUMO EM TEMPO REAL
              </span>
              <span className="text-sm font-semibold text-slate-300">
                {diaSemanaNome || 'Buscando sinal...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-400 font-mono text-lg font-extrabold shadow-inner">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{horaAtual || '00:00:00'}</span>
          </div>
        </div>

        {/* Card da Janela Ativa ou Radar em Espera */}
        {ofertaDestaque ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                🟢 JANELA SNIPER ATIVA ATÉ AS {ofertaDestaque.horario_gatilho.substring(0, 5)}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                {ofertaDestaque.plataforma}
              </span>
              {ofertaDestaque.selo_tag && (
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-mono border border-cyan-500/40">
                  #{ofertaDestaque.selo_tag}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-sans">
              {ofertaDestaque.titulo}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {ofertaDestaque.descricao}
            </p>

            {/* Ações da Janela Ativa */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {ofertaDestaque.codigo_cupom ? (
                <div className="flex items-center gap-2 bg-slate-950/90 px-4 py-2.5 rounded-xl border border-emerald-500/40">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400 uppercase font-mono">Cupom:</span>
                  <span className="font-mono text-base font-extrabold text-emerald-400 tracking-wider">
                    {ofertaDestaque.codigo_cupom}
                  </span>
                  <button
                    onClick={() => handleCopiar(ofertaDestaque.id, ofertaDestaque.codigo_cupom!)}
                    className="ml-2 p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition-colors"
                  >
                    {copiadoId === ofertaDestaque.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Desconto automático ativo na sacola
                </div>
              )}

              {ofertaDestaque.url_redirecionamento && (
                <a
                  href={ofertaDestaque.url_redirecionamento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.35)] transition-all"
                >
                  Ir Para Loja Oficial
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Radar className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-slate-200">Radar Monitorando Janelas Próximas...</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Nenhuma janela de pico extremo ativa nos últimos minutos para as suas categorias focadas. Fique atento à prévia de amanhã!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
