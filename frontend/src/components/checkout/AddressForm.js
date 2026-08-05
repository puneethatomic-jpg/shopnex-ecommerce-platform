'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const addressSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  zip: z.string().min(3, 'Zip code must be at least 3 characters'),
});

export default function AddressForm({ onSubmit, initialValues }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues || {
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-300">Street Address</label>
        <input 
          type="text" 
          placeholder="123 Main St" 
          {...register('address')}
          className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
        />
        {errors.address && <p className="text-[10px] text-red-400 mt-1">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">City</label>
          <input 
            type="text" 
            placeholder="New York" 
            {...register('city')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">State / Region</label>
          <input 
            type="text" 
            placeholder="NY" 
            {...register('state')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.state && <p className="text-[10px] text-red-400 mt-1">{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">Country</label>
          <input 
            type="text" 
            placeholder="United States" 
            {...register('country')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.country && <p className="text-[10px] text-red-400 mt-1">{errors.country.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">Zip / Postal Code</label>
          <input 
            type="text" 
            placeholder="10001" 
            {...register('zip')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.zip && <p className="text-[10px] text-red-400 mt-1">{errors.zip.message}</p>}
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="glow-btn mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Saving Address...' : 'Use This Address'}
      </button>
    </form>
  );
}
