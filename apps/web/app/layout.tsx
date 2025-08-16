import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import Navigation from '@/components/Navigation';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EDA Computers - Сборка компьютеров',
  description: 'Соберите свой идеальный компьютер с EDA Computers',
};

// Компонент-обертка для клиентских провайдеров
function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Suspense fallback={
          <div className="min-h-screen bg-dark-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan"></div>
          </div>
        }>
          <ClientProviders>
            <div className="min-h-screen bg-dark-950">
              <Navigation />
              <main>
                {children}
              </main>
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
