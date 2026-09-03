'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-100">Ocorreu um erro no aplicativo</h2>
      <p className="text-xs text-slate-400 max-w-md">{error.message || 'Falha ao processar requisição no Next.js App Router.'}</p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all"
      >
        <RefreshCw className="w-4 h-4" /> Recarregar Aplicação
      </button>
    </div>
  );
}
