'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/AuthContext';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Fetch products
  const { data: productRes, isLoading } = useQuery({
    queryKey: ['adminProductsList'],
    queryFn: () => api.get('/products'),
    enabled: isAdmin,
  });

  const { data: categoryRes } = useQuery({
    queryKey: ['adminCategoriesList'],
    queryFn: () => api.get('/categories'),
    enabled: isAdmin,
  });

  const products = productRes?.data || [];
  const categories = categoryRes?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeModal();
      toast.success('Product created successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeModal();
      toast.success('Product updated successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      toast.success('Product deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setPrice('');
    setDiscount('0');
    setStock('');
    setSku('');
    setCategoryId(categories[0]?.id || '');
    setBrandId('');
    setImageUrl('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setSlug(prod.slug);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setDiscount(prod.discount.toString());
    setStock(prod.stock.toString());
    setSku(prod.sku);
    setCategoryId(prod.categoryId);
    setBrandId(prod.brandId || '');
    setImageUrl(prod.images?.[0]?.url || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title,
      slug,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount || '0'),
      stock: parseInt(stock),
      sku,
      categoryId,
      brandId: brandId || null,
      images: imageUrl ? [imageUrl] : [],
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (!isAdmin) {
    return (
      <div className="px-6 md:px-12 py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-violet-400 mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Admin Access Required</h2>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Products Management</h1>
          <span className="text-xs text-slate-500 mt-0.5">Manage stock count and catalog parameters</span>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="glow-btn px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-xs">
        {products.length === 0 ? (
          <span className="text-slate-500 py-4">No products found.</span>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-300">{prod.sku}</td>
                    <td className="py-3.5 text-slate-200 font-semibold">{prod.title}</td>
                    <td className="py-3.5 text-slate-200">${prod.price.toFixed(2)}</td>
                    <td className="py-3.5 text-slate-400">${prod.discount.toFixed(2)}</td>
                    <td className="py-3.5 font-bold">
                      <span className={prod.stock < 5 ? 'text-red-400' : 'text-emerald-400'}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 bg-white/5 border border-white/10 hover:border-violet-500/30 text-slate-400 hover:text-violet-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Delete this product?')) deleteMutation.mutate(prod.id);
                          }}
                          className="p-1.5 bg-white/5 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Slug</label>
                  <input 
                    type="text" 
                    required 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea 
                  rows={3} 
                  required 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Discount</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={discount} 
                    onChange={(e) => setDiscount(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Stock</label>
                  <input 
                    type="number" 
                    required 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">SKU</label>
                  <input 
                    type="text" 
                    required 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Image URL</label>
                <input 
                  type="url" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white"
                />
              </div>

              <button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="glow-btn mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
