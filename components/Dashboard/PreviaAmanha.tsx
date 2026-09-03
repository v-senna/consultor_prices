'use client';

import React, { useState } from 'react';
import { Bell, BellRing, Calendar, Clock, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { OfertaCronograma } from '@/types';

interface PreviaAmanhaProps {
  ofertas: OfertaCronograma[];
}

export default function PreviaAmanha({ ofertas }: PreviaAmanhaProps) {
  const [lembretesAgendados, setLembretesAgendados] = useState<number[]>([]);

  const handleAgendarLembrete = (id: number, titulo: string) => {
    if (lembretesAgendados.includes(id)) {
      setLembretesAgendados(lembretesAgendados.filter(i => i !== id));
    } else {
      setLembretesAgendados([...lembretesAgendados, id]);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎯 Alerta Sniper Agendado!', {
          body: `Você receberá uma notificação quando a oferta "${titulo}" for liberada!`,
          icon: '/icons/icon-192.png'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="w-full">
      {/* Título da Seção */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
              Prévia de Amanhã <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">FORECAST</span>
            </h3>
            <p className="text-xs text-slate-400">Cronograma previsto de liberação de cupons e descontos por horário</p>
          </div>
        </div>
      </div>

      {/* Timeline Vertical de Ofertas */}
      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
        {ofertas.map((oferta, idx) => {
          const isAgendado = lembretesAgendados.includes(oferta.id);
          return (
            <div key={oferta.id || idx} className="relative group">
              {/* Marcador na Timeline */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-400 group-hover:border-emerald-300 group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(57,255,20,0.5)]" />

              {/* Card da Oferta */}
              <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 backdrop-blur-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      {oferta.horario_gatilho.substring(0, 5)}
                    </span>
                    <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                      {oferta.plataforma}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline-block">
                      • {oferta.categoria}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAgendarLembrete(oferta.id, oferta.titulo)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isAgendado
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isAgendado ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 text-emerald-400" /> Agendado
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-slate-400" /> Lembrar-me
                      </>
                    )}
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-100 mb-2">{oferta.titulo}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{oferta.descricao}</p>

                {/* Tags e Vantagens */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60">
                  {oferta.codigo_cupom && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Tag className="w-3 h-3" /> Cupom: {oferta.codigo_cupom}
                    </span>
                  )}
                  {oferta.valor_minimo_compra && oferta.valor_minimo_compra > 0 ? (
                    <span className="text-xs text-slate-400">
                      Mínimo: R$ {oferta.valor_minimo_compra.toFixed(2)}
                    </span>
                  ) : null}
                  {oferta.selo_tag && (
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      #{oferta.selo_tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
