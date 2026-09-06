'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Bot, X, ArrowRight, Zap, Flame, Award, ShoppingBag, Send } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

export default function FloatingAiAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hi! 👋 I am your ShopNex Personal Shopping Assistant. What are you looking for today?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const promptShortcuts = [
    { label: '⚡ Under $100', query: 'under 100' },
    { label: '🔥 Top Trending', query: 'trending' },
    { label: '✨ High Rated', query: 'high rated' },
    { label: '🎧 Audio & Gaming', query: 'gaming audio' },
  ];

  const handleShortcutClick = async (query, label) => {
    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: label };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      let fetched = [];
      if (query === 'under 100') {
        const res = await api.get('/products');
        if (res.success) {
          fetched = res.data.products.filter(p => (p.price - p.discount) <= 100).slice(0, 3);
        }
      } else if (query === 'high rated') {
        const res = await api.get('/products');
        if (res.success) {
          fetched = [...res.data.products].sort((a, b) => b.rating - a.rating).slice(0, 3);
        }
      } else {
        const res = await api.get(`/products?search=${encodeURIComponent(query)}`);
        if (res.success) {
          fetched = res.data.products.slice(0, 3);
        }
      }

      setRecommendations(fetched);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Here are my top recommendations for "${label}":`,
          products: fetched,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'I had trouble fetching recommendations right now. Please browse our shop catalogue!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSend = async (e) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');
    await handleShortcutClick(userText, userText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-900/40 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-xl relative">
                <Sparkles className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-tight">ShopNex AI Assistant</h4>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-violet-500/20 text-violet-300 rounded border border-violet-500/30">PRO</span>
                </div>
                <span className="text-[10px] text-slate-400">Powered by ShopNex Recommendation Engine</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages scroll section */}
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-br-none'
                      : 'bg-slate-950/80 border border-white/5 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Product recommendations card attachment */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full flex flex-col gap-2 mt-1">
                    {msg.products.map((p) => {
                      const finalPrice = p.price - p.discount;
                      const imageUrl = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/products/${p.slug}`);
                          }}
                          className="flex items-center gap-3 p-2 bg-slate-950/90 border border-violet-500/20 rounded-xl hover:border-violet-500/50 cursor-pointer transition-all group"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                            <Image src={imageUrl} alt={p.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-white group-hover:text-violet-300 truncate">
                              {p.title}
                            </h5>
                            <span className="text-[10px] text-violet-400 font-semibold">${finalPrice.toFixed(2)}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2 bg-slate-950/50 rounded-xl text-slate-400 text-[11px]">
                <div className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching recommendations...</span>
              </div>
            )}
          </div>

          {/* Quick shortcuts pills */}
          <div className="p-2.5 bg-slate-950/80 border-t border-white/5 flex flex-wrap gap-1.5">
            {promptShortcuts.map((sc) => (
              <button
                key={sc.label}
                onClick={() => handleShortcutClick(sc.query, sc.label)}
                className="px-2.5 py-1 bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/30 text-[10px] font-semibold text-slate-300 hover:text-white rounded-full transition-all"
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form onSubmit={handleCustomSend} className="p-3 bg-slate-950 border-t border-white/5 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI for products, deals..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glow-btn px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-[0_4px_25px_rgba(124,58,237,0.4)] flex items-center gap-2.5 font-semibold text-xs transition-all hover:scale-105"
      >
        <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
        <span>Ask AI Assistant</span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
      </button>
    </div>
  );
}
