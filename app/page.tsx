'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import RadarAtivo from '@/components/Dashboard/RadarAtivo';
import PreviaAmanha from '@/components/Dashboard/PreviaAmanha';
import OnboardingModal from '@/components/Dashboard/OnboardingModal';
import InstallPWA from '@/components/UI/InstallPWA';
import AlertaPopup from '@/components/UI/AlertaPopup';
import { OfertaCronograma } from '@/types';
import { Filter, RefreshCw, Sparkles, User } from 'lucide-react';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [ofertas, setOfertas] = useState<OfertaCronograma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriasFocadas, setCategoriasFocadas] = useState<string[]>([
    'Tecnologia & Informática',
    'Moda & Vestuário',
    'Passagens & Viagens',
    'Supermercado & Abastecimento',
  ]);
  const [categoriaFiltroAtiva, setCategoriaFiltroAtiva] = useState<string>('Todas');
  const [ofertaSelecionada, setOfertaSelecionada] = useState<OfertaCronograma | null>(null);

  const carregarOfertas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ofertas');
      const data = await res.json();
      if (data.success && data.ofertas) {
        setOfertas(data.ofertas);
      }
    } catch (err) {
      console.error('Erro ao carregar ofertas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOfertas();

    const userId = usuario ? usuario.id : 1;
    fetch('/api/preferencias', {
      headers: { 'x-user-id': String(userId) },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.categorias_focadas) {
          setCategoriasFocadas(data.data.categorias_focadas);
        }
      })
      .catch(() => {});
  }, [usuario]);

  const handleOnboardingComplete = (novasCategorias: string[]) => {
    setCategoriasFocadas(novasCategorias);
    carregarOfertas();
  };

  // Filtrar ofertas exibidas na tela
  const ofertasFiltradas = ofertas.filter((of) => {
    if (categoriaFiltroAtiva === 'Todas') return true;
    return of.categoria.toLowerCase().includes(categoriaFiltroAtiva.toLowerCase());
  });

  const categoriasDisponiveis = [
    'Todas',
    'Tecnologia & Informática',
    'Moda & Vestuário',
    'Passagens & Viagens',
    'Supermercado & Abastecimento',
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Instalação do PWA */}
      <InstallPWA />

      {/* Modal de Onboarding no 1º Acesso */}
      <OnboardingModal onComplete={handleOnboardingComplete} />

      {/* Pop-up de Alerta Sniper */}
      {ofertaSelecionada && (
        <AlertaPopup
          oferta={ofertaSelecionada}
          onClose={() => setOfertaSelecionada(null)}
        />
      )}

      {/* Card do Radar Ativo */}
      <RadarAtivo ofertas={ofertas} categoriasFocadas={categoriasFocadas} />

      {/* Barra de Filtros Rápidos de Categorias */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>FILTRAR CANAL DE VARREDURA:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categoriasDisponiveis.map((cat) => {
            const isSelected = categoriaFiltroAtiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaFiltroAtiva(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(57,255,20,0.2)]'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button
          onClick={carregarOfertas}
          className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
          title="Atualizar Radar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Lista de Janelas do Radar Detectadas */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Janelas e Cupons Mapeados pelo Radar ({ofertasFiltradas.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ofertasFiltradas.map((of) => (
            <div
              key={of.id}
              onClick={() => setOfertaSelecionada(of)}
              className="cursor-pointer p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] transition-all group backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {of.plataforma}
                  </span>
                  {of.ativo_agora ? (
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                      🟢 GATILHO ATIVO
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">
                      Gatilho: {of.horario_gatilho.substring(0, 5)}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition-colors mb-2">
                  {of.titulo}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {of.descricao}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono">
                <span className="text-emerald-400 font-bold">
                  {of.codigo_cupom ? `Cupom: ${of.codigo_cupom}` : 'Desconto Direto'}
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-[11px]">
                  Ver Detalhes →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prévia de Amanhã (Forecast Timeline) */}
      <PreviaAmanha ofertas={ofertasFiltradas} />
    </div>
  );
}
