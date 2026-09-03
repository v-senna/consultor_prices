'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { SlidersHorizontal, ShieldCheck, Bell, Save, CheckCircle2, Laptop, Shirt, Plane, ShoppingBag, User } from 'lucide-react';

export default function PreferenciasPage() {
  const { usuario } = useAuth();
  const [categoriasFocadas, setCategoriasFocadas] = useState<string[]>([
    'Tecnologia & Informática',
    'Moda & Vestuário',
    'Passagens & Viagens',
    'Supermercado & Abastecimento',
  ]);
  const [maxAlertas, setMaxAlertas] = useState<number>(5);
  const [pushAtivado, setPushAtivado] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<boolean>(false);

  const categorias = [
    {
      id: 'Tecnologia & Informática',
      titulo: 'Tecnologia & Informática',
      descricao: 'Laptops, celulares, consoles e games com cupons Mercado Livre & Black Friday',
      icon: Laptop,
    },
    {
      id: 'Moda & Vestuário',
      titulo: 'Moda & Vestuário',
      descricao: 'Vestuário fitness, liquidações de verão/inverno Renner e cupom BOHOCHIC',
      icon: Shirt,
    },
    {
      id: 'Passagens & Viagens',
      titulo: 'Passagens & Viagens',
      descricao: 'Voos de madrugada (terça/quarta), bônus de milhas e destinos de praia',
      icon: Plane,
    },
    {
      id: 'Supermercado & Abastecimento',
      titulo: 'Supermercado & Abastecimento',
      descricao: 'Campanha "Fecha Mês" nos últimos 5 dias do mês (Supermercado Rio Branco Araras SP)',
      icon: ShoppingBag,
    },
  ];

  useEffect(() => {
    const userId = usuario ? usuario.id : 1;
    fetch('/api/preferencias', {
      headers: { 'x-user-id': String(userId) },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategoriasFocadas(data.data.categorias_focadas || []);
          setMaxAlertas(data.data.max_alertas_por_dia || 5);
          setPushAtivado(data.data.push_ativado ?? true);
        }
      })
      .catch(() => {});
  }, [usuario]);

  const toggleCategoria = (catId: string) => {
    if (categoriasFocadas.includes(catId)) {
      setCategoriasFocadas(categoriasFocadas.filter((c) => c !== catId));
    } else {
      setCategoriasFocadas([...categoriasFocadas, catId]);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    const userId = usuario ? usuario.id : 1;
    try {
      localStorage.setItem(`sniper_categorias_focadas_${userId}`, JSON.stringify(categoriasFocadas));

      const res = await fetch('/api/preferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(userId),
        },
        body: JSON.stringify({
          usuario_id: userId,
          categorias_focadas: categoriasFocadas,
          max_alertas_por_dia: maxAlertas,
          push_ativado: pushAtivado,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMensagemSucesso(true);
        setTimeout(() => setMensagemSucesso(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans">
              Filtros & <span className="text-emerald-400">Controle Antispam</span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalize seu radar a qualquer momento. Marque ou desmarque categorias para silenciar alertas indesejados.
            </p>
          </div>
        </div>

        {/* Card do Usuário Logado */}
        {usuario && (
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-emerald-500/30">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-mono">Radar de: <strong className="text-emerald-400">{usuario.nome}</strong></span>
          </div>
        )}
      </div>

      {/* Grid de Categorias Focadas */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200 font-sans flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Categorias Monitoradas em Tempo Real ({categoriasFocadas.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            const isSelected = categoriasFocadas.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategoria(cat.id)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-[0_0_20px_rgba(57,255,20,0.15)] ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/30 border-slate-800 opacity-50 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
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
      </div>

      {/* Configurações Adicionais de Alertas */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
        <h3 className="text-base font-bold text-slate-200 font-sans flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          Frequência e Notificações Locais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider Limite de Alertas */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Limite Máximo de Alertas/Dia:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{maxAlertas} alertas</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={maxAlertas}
              onChange={(e) => setMaxAlertas(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Toggle Push Notification */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-100 block">Notificações Push PWA</span>
              <span className="text-[11px] text-slate-400">Receber avisos locais quando gatilhos abrirem</span>
            </div>
            <button
              onClick={() => setPushAtivado(!pushAtivado)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${pushAtivado ? 'bg-emerald-500' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform duration-200 ${pushAtivado ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(57,255,20,0.4)] transition-all"
        >
          {mensagemSucesso ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-slate-950" /> Preferências Atualizadas para {usuario?.nome.split(' ')[0] || 'Usuário'}!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Salvar Preferências do Meu Perfil
            </>
          )}
        </button>
      </div>
    </div>
  );
}
