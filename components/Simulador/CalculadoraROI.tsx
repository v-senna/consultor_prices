'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { Calculator, TrendingDown, Sparkles, CheckCircle, Save, Tag, DollarSign, ArrowRight, User } from 'lucide-react';
import { CategoriaOferta } from '@/types';

export default function CalculadoraROI() {
  const { usuario } = useAuth();
  const [categoria, setCategoria] = useState<string>('Tecnologia & Informática');
  const [nomeProduto, setNomeProduto] = useState<string>('Notebook Gamer / Smartphone Flagship');
  const [precoBase, setPrecoBase] = useState<number>(3500);
  const [descontoPercentual, setDescontoPercentual] = useState<number>(15);
  const [cupomFixo, setCupomFixo] = useState<number>(200);
  const [cashbackPercentual, setCashbackPercentual] = useState<number>(5);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [salvoSucesso, setSalvoSucesso] = useState<boolean>(false);
  const [economiaAcumuladaTotal, setEconomiaAcumuladaTotal] = useState<number>(0);

  // Carregar economia acumulada do usuário logado
  useEffect(() => {
    const userId = usuario ? usuario.id : 1;
    fetch('/api/economia', {
      headers: { 'x-user-id': String(userId) },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.total_economizado !== undefined) {
          setEconomiaAcumuladaTotal(data.total_economizado);
        }
      })
      .catch(() => {});
  }, [usuario]);

  // Cálculo Matemático da Economia Real e ROI
  const valorDescontoPercentual = precoBase * (descontoPercentual / 100);
  const precoAposPercentual = Math.max(0, precoBase - valorDescontoPercentual);
  const precoAposCupom = Math.max(0, precoAposPercentual - cupomFixo);
  const valorCashback = precoBase * (cashbackPercentual / 100);
  const precoFinal = Math.max(0, precoAposCupom - valorCashback);

  const economiaReal = Math.max(0, precoBase - precoFinal);
  const percentualRealTotal = precoBase > 0 ? (economiaReal / precoBase) * 100 : 0;

  const gerarNarrativaCombo = () => {
    const vantagens: string[] = [];
    if (descontoPercentual > 0) vantagens.push(`janela promocional Sniper (${descontoPercentual}% OFF)`);
    if (cupomFixo > 0) vantagens.push(`Cupom de R$ ${cupomFixo.toFixed(2)}`);
    if (cashbackPercentual > 0) vantagens.push(`Cashback de ${cashbackPercentual}% no cartão parceiro`);

    if (vantagens.length === 0) return 'Selecione ou ajuste as vantagens acima para simular sua economia.';
    return `🎯 Sniper Combo Ativo! Você combinou a ${vantagens.join(' + ')}.`;
  };

  const handleRegistrarEconomia = async () => {
    if (economiaReal <= 0) return;
    setSalvando(true);
    const userId = usuario ? usuario.id : 1;
    try {
      const res = await fetch('/api/economia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(userId),
        },
        body: JSON.stringify({
          usuario_id: userId,
          nome_produto: nomeProduto,
          categoria,
          preco_original: precoBase,
          preco_final: precoFinal,
          plataforma: 'Sniper ROI Simulator',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSalvoSucesso(true);
        setEconomiaAcumuladaTotal((prev) => prev + economiaReal);
        setTimeout(() => setSalvoSucesso(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Widget Global da Economia Acumulada do Usuário Logado */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(57,255,20,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TrendingDown className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-widest block">
              PAINEL DE ROI DE {usuario ? usuario.nome.toUpperCase() : 'SNIPER DEMO'}
            </span>
            <h3 className="text-xl font-extrabold text-slate-100 font-sans">
              Minha Economia Acumulada no Ano
            </h3>
          </div>
        </div>

        <div className="text-right bg-slate-950/80 px-6 py-3 rounded-2xl border border-emerald-500/30">
          <span className="text-xs text-slate-400 block font-mono">TOTAL SALVO PELO SNIPER</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(57,255,20,0.5)]">
            R$ {economiaAcumuladaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Grid de Formulário + Card Translúcido de Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário de Entradas (Inputs) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-lg text-slate-100 font-sans">Parâmetros da Compra</h4>
            </div>
            {usuario && (
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> {usuario.nome.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Categoria do Produto/Serviço
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="Tecnologia & Informática">Tecnologia & Informática</option>
              <option value="Moda & Vestuário">Moda & Vestuário</option>
              <option value="Passagens & Viagens">Passagens & Viagens</option>
              <option value="Supermercado & Abastecimento">Supermercado & Abastecimento</option>
            </select>
          </div>

          {/* Nome do Produto */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Nome do Produto / Serviço
            </label>
            <input
              type="text"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              placeholder="Ex: iPhone 15, Voo para Porto de Galinhas, Compra do Mês"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Preço Base / Impulso */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Preço Base sem Desconto (Compra Normal por Impulso - R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">R$</span>
              <input
                type="number"
                value={precoBase}
                onChange={(e) => setPrecoBase(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-base font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Controles de Vantagens (Sliders & Inputs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Janela Sniper (% OFF)</label>
              <input
                type="number"
                value={descontoPercentual}
                onChange={(e) => setDescontoPercentual(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cupom Aplicado (R$)</label>
              <input
                type="number"
                value={cupomFixo}
                onChange={(e) => setCupomFixo(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cashback (% Extra)</label>
              <input
                type="number"
                value={cashbackPercentual}
                onChange={(e) => setCashbackPercentual(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Card Translúcido Animado de Resultado (Output ROI) */}
        <div className="lg:col-span-5 flex flex-col">
          <motion.div
            key={`${precoBase}-${descontoPercentual}-${cupomFixo}-${cashbackPercentual}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 rounded-3xl bg-slate-900/90 border border-emerald-500/50 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(57,255,20,0.2)] flex flex-col justify-between relative overflow-hidden"
          >
            {/* Feixe de Luz de Fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
                  SIMULAÇÃO DE ECONOMIA REAL
                </span>
                <span className="text-xs font-mono text-cyan-400 font-extrabold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  -{percentualRealTotal.toFixed(1)}% OFF
                </span>
              </div>

              {/* Total Economizado com Destaque Neon Green */}
              <div className="my-6 p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block mb-1">
                  Economia Direta no Seu Bolso
                </span>
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(57,255,20,0.6)]">
                  R$ {economiaReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Detalhamento de Preço Final */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Preço Impulso Original:</span>
                  <span className="font-mono line-through">R$ {precoBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-100 font-bold pt-2 border-t border-slate-800">
                  <span>Preço Final Sniper:</span>
                  <span className="font-mono text-emerald-400 text-lg">R$ {precoFinal.toFixed(2)}</span>
                </div>
              </div>

              {/* Narrativa Inteligente */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6">
                {gerarNarrativaCombo()}
              </div>
            </div>

            {/* Botão Registrar Economia */}
            <button
              onClick={handleRegistrarEconomia}
              disabled={salvando || economiaReal <= 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(57,255,20,0.4)] disabled:opacity-50 transition-all"
            >
              {salvoSucesso ? (
                <>
                  <CheckCircle className="w-5 h-5 text-slate-950" /> Economia Registrada para {usuario?.nome.split(' ')[0] || 'Perfil'}!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Registrar Economia no Perfil de {usuario?.nome.split(' ')[0] || 'Usuário'}
                </>
              )}
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
