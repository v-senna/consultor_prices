import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import Navegacao from '@/components/UI/Navegacao';
import RadarScanEffect from '@/components/UI/RadarScanEffect';

export const metadata: Metadata = {
  title: 'Sniper de Ofertas - Radar de Consumo Inteligente',
  description: 'Aplicação PWA de alta fidelidade que mapeia janelas promocionais por horário, cupons e simulação de economia em tempo real.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sniper Ofertas',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0f17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-sans">
        <AuthProvider>
          {/* Efeito de Escaneamento de Radar de Fundo */}
          <RadarScanEffect />

          {/* Navegação Superior/Inferior */}
          <Navegacao />

          {/* Conteúdo Principal */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 z-10 relative">
            {children}
          </main>

          {/* Rodapé Tático */}
          <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 z-10 relative hidden md:block">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
              <span>© 2026 Sniper de Ofertas PWA • Radar de Consumo Inteligente</span>
              <span className="font-mono text-emerald-400/80">LGPD OK • Sessão por usuário</span>
            </div>
          </footer>
        </AuthProvider>

        {/* Registro do Service Worker do PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker PWA registrado com sucesso:', registration.scope);
                    },
                    function(err) {
                      console.log('Falha ao registrar ServiceWorker PWA:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
