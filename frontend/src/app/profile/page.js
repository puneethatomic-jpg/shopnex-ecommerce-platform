'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/store/AuthContext';
import api from '@/lib/api';
import { User, MapPin, ClipboardList, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);

  // Fetch full user details (including orders, addresses)
  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => api.get(`/users/${user.id}`),
    enabled: !!user,
  });

  const profile = profileRes?.data;
  const orders = profile?.orders || [];
  const addresses = profile?.addresses || [];

  // Update profile details mutation
  const updateMutation = useMutation({
    mutationFn: (updateData) => api.put(`/users/${user.id}`, updateData),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['profile', user.id]);
      setEditing(false);
      toast.success('Profile details updated successfully!');
    },
    onError: (err) => {
      toast.error('Failed to update details');
    },
  });

  const handleStartEdit = () => {
    setName(profile?.name || '');
    setPhone(profile?.phone || '');
    setEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate({ name, phone });
  };

  if (isLoading || !profile) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full flex flex-col gap-10 animate-pulse text-xs">
        <div className="bg-slate-900 h-10 w-1/4 rounded-full"></div>
        <div className="bg-slate-900 h-32 w-full rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto w-full flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Account</h1>
        <span className="text-xs text-slate-500 mt-0.5">Manage details, addresses, and track orders</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Info */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-200 text-lg font-bold uppercase">
                {profile.name[0]}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white leading-none">{profile.name}</h3>
                <span className="text-[10px] text-slate-500 capitalize mt-1">{profile.role} Profile</span>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-400">Phone</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value || '')}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-2.5 mt-2">
                  <button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="glow-btn flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-200">{profile.email}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-200">{profile.phone || 'Not provided'}</span>
                </div>
                <button 
                  onClick={handleStartEdit}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Addresses Card */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-violet-400" />
              Saved Addresses
            </h3>
            
            {addresses.length === 0 ? (
              <span className="text-xs text-slate-500">No saved addresses found.</span>
            ) : (
              <div className="flex flex-col gap-3.5 text-xs text-slate-400">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-200 block">{addr.city}, {addr.state}</span>
                    <span className="text-[11px] block mt-0.5">{addr.address}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{addr.country} - {addr.zip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Log */}
        <div className="lg:col-span-2 bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-4.5 h-4.5 text-violet-400" />
            Order History ({orders.length} orders)
          </h3>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-xs text-slate-500">You haven't placed any orders yet.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-slate-950 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Order #{ord.id.slice(0, 8)}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'DELIVERED' 
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>{ord.status}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-500">Total Price</span>
                      <span className="font-bold text-white">${ord.total.toFixed(2)}</span>
                    </div>
                    <Link 
                      href={`/orders/${ord.id}`}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold transition-all"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
