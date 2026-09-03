'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ShieldCheck, ArrowRight, Laptop, Shirt, Plane, ShoppingBag } from 'lucide-react';
import { CategoriaOferta } from '@/types';

interface OnboardingModalProps {
  onComplete: (categoriasSelecionadas: string[]) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selecionadas, setSelecionadas] = useState<string[]>([
    'Tecnologia & Informática',
    'Moda & Vestuário',
    'Passagens & Viagens',
    'Supermercado & Abastecimento'
  ]);

  const categorias = [
    {
      id: 'Tecnologia & Informática',
      titulo: 'Tecnologia & Informática',
      descricao: 'Laptops, smartphones, consoles, games e gadgets com cupons expressos',
      icon: Laptop,
    },
    {
      id: 'Moda & Vestuário',
      titulo: 'Moda & Vestuário',
      descricao: 'Roupas esportivas, biquínis de verão, casacos de inverno e cupons Renner/ML',
      icon: Shirt,
    },
    {
      id: 'Passagens & Viagens',
      titulo: 'Passagens & Viagens',
      descricao: 'Voos de madrugada (28-35 dias antecedência), bônus milhas e praias na baixa temporada',
      icon: Plane,
    },
    {
      id: 'Supermercado & Abastecimento',
      titulo: 'Supermercado & Abastecimento',
      descricao: 'Campanha "Fecha Mês" nos últimos 5 dias do mês (Carnes, limpeza e hortifruti)',
      icon: ShoppingBag,
    },
  ];

  useEffect(() => {
    const onboardingFeito = localStorage.getItem('sniper_onboarding_completo');
    if (!onboardingFeito) {
      setIsOpen(true);
    }
  }, []);

  const toggleCategoria = (catId: string) => {
    if (selecionadas.includes(catId)) {
      setSelecionadas(selecionadas.filter((c) => c !== catId));
    } else {
      setSelecionadas([...selecionadas, catId]);
    }
  };

  const handleConcluir = () => {
    localStorage.setItem('sniper_onboarding_completo', 'true');
    localStorage.setItem('sniper_categorias_focadas', JSON.stringify(selecionadas));
    setIsOpen(false);
    onComplete(selecionadas);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(57,255,20,0.25)] text-slate-100 overflow-hidden"
        >
          {/* Animação Radar Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Cabeçalho */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/50 mb-4 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
              <Target className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
              Bem-vindo ao <span className="text-emerald-400">Sniper de Ofertas</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Configure seu radar de consumo antispam. Escolha apenas o que realmente interessa para ser alertado nos momentos exatos de gatilho.
            </p>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
            {categorias.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selecionadas.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategoria(cat.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-950/80 border-emerald-500/60 shadow-[0_0_20px_rgba(57,255,20,0.15)] ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-700'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 mb-1">{cat.titulo}</h4>
                    <p className="text-xs text-slate-400 leading-snug">{cat.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé do Onboarding */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Antispam Ativo • Altere a qualquer momento</span>
            </div>
            <button
              onClick={handleConcluir}
              disabled={selecionadas.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Ativar Meu Radar ({selecionadas.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
