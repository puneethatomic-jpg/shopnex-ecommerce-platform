'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/store/AuthContext';
import api from '@/lib/api';
import DashboardCard from '@/components/admin/DashboardCard';
import DashboardCharts from '@/components/admin/DashboardCharts';
import { DollarSign, ShoppingCart, Users, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Queries
  const { data: orderRes, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => api.get('/orders'),
    enabled: !!user && user.role === 'ADMIN',
  });

  const { data: productRes } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => api.get('/products'),
    enabled: !!user && user.role === 'ADMIN',
  });

  const { data: userRes } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => api.get('/users'),
    enabled: !!user && user.role === 'ADMIN',
  });

  const orders = orderRes?.data || [];
  const products = productRes?.data || [];
  const users = userRes?.data || [];

  // Calculate dashboard stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  if (authLoading) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-6xl mx-auto w-full animate-pulse text-xs">
        <div className="bg-slate-900 h-10 w-1/4 rounded-full"></div>
      </div>
    );
  }

  // Auth Guard
  if (!isAdmin) {
    return (
      <div className="px-6 md:px-12 py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-violet-400 mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight">Admin Portal Access Denied</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          You must have administrator privileges to view this portal. Please toggle the developer role switch in the top bar to "Admin" to continue.
        </p>
        <Link 
          href="/" 
          className="glow-btn mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
      {/* Overview stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <span className="text-xs text-slate-500 mt-0.5">Welcome, {user.name}. Overview of ShopNex stats.</span>
        </div>

        {/* Action buttons shortcut */}
        <div className="flex gap-3 text-xs">
          <Link href="/admin/products" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all">
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <DashboardCard 
          title="Total Orders" 
          value={orders.length}
          change={`+${pendingOrders} pending`}
          changeType="positive"
          icon={ShoppingCart}
        />
        <DashboardCard 
          title="Active Customers" 
          value={users.length}
          change="+4.8%"
          changeType="positive"
          icon={Users}
        />
        <DashboardCard 
          title="Listed Products" 
          value={products.length}
          change={`${products.filter((p) => p.stock < 5).length} low stock`}
          changeType="negative"
          icon={Package}
        />
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Recent orders table */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-xs">
        <h3 className="text-sm font-bold text-white">Recent Orders</h3>
        
        {orders.length === 0 ? (
          <span className="text-slate-500 py-4">No recent orders found.</span>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-300">{ord.id.slice(0, 8)}...</td>
                    <td className="py-3.5 text-slate-200">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3.5 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 text-slate-200 font-semibold">${ord.total.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        ord.status === 'DELIVERED' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>{ord.status}</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link 
                        href={`/orders/${ord.id}`} 
                        className="text-violet-400 hover:text-violet-300 transition-colors font-bold"
                      >
                        View
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
