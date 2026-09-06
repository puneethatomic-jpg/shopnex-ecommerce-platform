'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CommandSearchModal from '@/components/search/CommandSearchModal';
import FloatingAiAssistant from '@/components/ai/FloatingAiAssistant';

export default function AppShell({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keydown listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CommandSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <FloatingAiAssistant />
    </div>
  );
}
