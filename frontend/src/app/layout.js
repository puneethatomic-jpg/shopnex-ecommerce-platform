import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/store/Providers';
import AuthGateway from '@/components/auth/AuthGateway';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'ShopNex — Modern E-Commerce Platform',
  description: 'A hyper-professional e-commerce marketplace powered by Next.js 15, Tailwind CSS v4, Express, and Prisma.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <Providers>
          <AuthGateway />
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
