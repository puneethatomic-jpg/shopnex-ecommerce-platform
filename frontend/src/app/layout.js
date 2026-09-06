import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/store/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGateway from '@/components/auth/AuthGateway';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'ShopNex — Modern E-Commerce Platform',
  description: 'A beautiful, feature-rich full-stack e-commerce marketplace powered by Next.js, Express, PostgreSQL, and Redis caching.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <Providers>
          <AuthGateway />
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
