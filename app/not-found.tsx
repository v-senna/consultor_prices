import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="text-6xl font-black text-emerald-400 font-mono drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]">
        404
      </div>
      <h2 className="text-xl font-bold text-slate-100">Página não encontrada</h2>
      <p className="text-sm text-slate-400 max-w-md">
        A rota que você tentou acessar não existe no Sniper de Ofertas.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all"
      >
        Voltar ao Radar
      </Link>
    </div>
  );
}
