'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/AuthContext';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  // Fetch orders
  const { data: orderRes, isLoading } = useQuery({
    queryKey: ['adminOrdersList'],
    queryFn: () => api.get('/orders'),
    enabled: isAdmin,
  });

  const orders = orderRes?.data || [];

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}`, { status }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['adminOrdersList']);
      toast.success(`Order status updated to ${res.data.status}`);
    },
    onError: (err) => {
      toast.error('Failed to update status');
    },
  });

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (!isAdmin) {
    return (
      <div className="px-6 md:px-12 py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-violet-400 mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight">Admin Portal Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col border-b border-white/5 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Orders Management</h1>
        <span className="text-xs text-slate-500 mt-0.5">Moderate shipment tracker progress and logs</span>
      </div>

      {/* Orders Grid */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-xs">
        {orders.length === 0 ? (
          <span className="text-slate-500 py-4">No orders placed yet.</span>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total Charged</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Tracking Status</th>
                  <th className="pb-3 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-300">{ord.id.slice(0, 8)}...</td>
                    <td className="py-3.5 text-slate-200">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3.5 text-slate-200 font-semibold">${ord.total.toFixed(2)}</td>
                    <td className="py-3.5 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`px-2 py-1 rounded bg-slate-950 border border-white/10 text-xs font-bold focus:outline-none ${
                          ord.status === 'DELIVERED' 
                            ? 'text-emerald-400' 
                            : ord.status === 'CANCELLED' 
                            ? 'text-red-400' 
                            : 'text-amber-400'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link 
                        href={`/orders/${ord.id}`} 
                        className="text-violet-400 hover:text-violet-300 font-bold transition-colors"
                      >
                        Track Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
