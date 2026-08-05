'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/AuthContext';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');

  // Fetch categories tree
  const { data: categoryRes, isLoading } = useQuery({
    queryKey: ['adminCategoriesList'],
    queryFn: () => api.get('/categories'),
    enabled: isAdmin,
  });

  const categories = categoryRes?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoriesList']);
      setModalOpen(false);
      setName('');
      setSlug('');
      setParentId('');
      toast.success('Category created successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategoriesList']);
      toast.success('Category deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete category');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug,
      parentId: parentId || null,
    });
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
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Categories Management</h1>
          <span className="text-xs text-slate-500 mt-0.5">Manage hierarchical parent & subcategories</span>
        </div>

        <button 
          onClick={() => setModalOpen(true)}
          className="glow-btn px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {categories.length === 0 ? (
          <span className="text-slate-500 py-4 col-span-2">No categories found.</span>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-sm">{cat.name}</span>
                  <span className="text-[10px] text-slate-500">Slug: {cat.slug}</span>
                </div>
                <button 
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) deleteMutation.mutate(cat.id);
                  }}
                  className="p-1.5 bg-white/5 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subcategories (children) */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Subcategories</span>
                {cat.children && cat.children.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {cat.children.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between bg-slate-950 border border-white/5 rounded-xl px-3 py-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-300">{sub.name}</span>
                          <span className="text-[9px] text-slate-500">Slug: {sub.slug}</span>
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm(`Delete subcategory "${sub.name}"?`)) deleteMutation.mutate(sub.id);
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 hover:scale-105 transition-all"
                          title="Delete Subcategory"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600">No subcategories linked yet.</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal create Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Category</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Electronics"
                  className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Slug</label>
                <input 
                  type="text" 
                  required 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="electronics"
                  className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Parent Category (Optional)</label>
                <select 
                  value={parentId} 
                  onChange={(e) => setParentId(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                >
                  <option value="">None (Creates Parent Category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={createMutation.isPending}
                className="glow-btn mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
