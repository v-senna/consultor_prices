'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, ExternalLink, Copy, Check, Zap } from 'lucide-react';
import { OfertaCronograma } from '@/types';

interface AlertaPopupProps {
  oferta: OfertaCronograma | null;
  onClose: () => void;
}

export default function AlertaPopup({ oferta, onClose }: AlertaPopupProps) {
  const [copiado, setCopiado] = useState(false);

  if (!oferta) return null;

  const handleCopiarCupom = () => {
    if (oferta.codigo_cupom) {
      navigator.clipboard.writeText(oferta.codigo_cupom);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-[0_0_50px_rgba(57,255,20,0.25)] p-6 text-slate-100 overflow-hidden"
        >
          {/* Efeito Glow de Varrida no Topo */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cabeçalho do Alerta */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              <Zap className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 uppercase tracking-widest">
                  GATILHO SNIPER ATIVO
                </span>
                {oferta.selo_tag && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold">
                    #{oferta.selo_tag}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1 font-sans">{oferta.titulo}</h3>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-sm text-slate-300 leading-relaxed mb-5 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            {oferta.descricao}
          </p>

          {/* Card do Cupom / Desconto */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Plataforma</span>
              <span className="font-semibold text-slate-200 text-sm">{oferta.plataforma}</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Vantagem Principal</span>
              <span className="font-bold text-emerald-400 text-sm">
                {oferta.desconto_percentual_esperado
                  ? `${oferta.desconto_percentual_esperado}% EXTRA`
                  : oferta.desconto_cupom_fixo
                  ? `R$ ${oferta.desconto_cupom_fixo} OFF`
                  : 'Condição Especial'}
              </span>
            </div>
          </div>

          {/* Código do Cupom com Copiar */}
          {oferta.codigo_cupom && (
            <div className="mb-6 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-400 uppercase font-mono tracking-wider block">
                  Código de Cupom Ativo:
                </span>
                <span className="font-mono text-lg font-extrabold text-emerald-300 tracking-wider">
                  {oferta.codigo_cupom}
                </span>
              </div>
              <button
                onClick={handleCopiarCupom}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
              >
                {copiado ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Cupom
                  </>
                )}
              </button>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center gap-3">
            {oferta.url_redirecionamento && (
              <a
                href={oferta.url_redirecionamento}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all"
              >
                Aproveitar Oferta Agora
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
