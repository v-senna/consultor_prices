import React from 'react';
import CalculadoraROI from '@/components/Simulador/CalculadoraROI';

export const metadata = {
  title: 'Simulador de Economia & ROI - Sniper de Ofertas',
  description: 'Calcule quanto você economiza combinando janelas de oferta, cupons e cashback vs compras por impulso.',
};

export default function SimuladorPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Simulador de <span className="text-emerald-400">Economia & ROI</span>
        </h1>
        <p className="text-sm text-slate-400">
          Prove o valor do aplicativo calculando o retorno real de comprar no momento de gatilho estratégico em vez de comprar por impulso.
        </p>
      </div>

      {/* Calculadora ROI */}
      <CalculadoraROI />
    </div>
  );
}
