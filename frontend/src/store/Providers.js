'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { RecentlyViewedProvider } from './RecentlyViewedContext';
import { Toaster } from 'sonner';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            {children}
            <Toaster position="top-right" richColors closeButton theme="dark" />
          </RecentlyViewedProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
