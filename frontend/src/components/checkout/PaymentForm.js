'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard } from 'lucide-react';

const paymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be exactly 3 digits'),
});

export default function PaymentForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs">
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
        <CreditCard className="w-5 h-5 text-violet-400" />
        <div className="flex flex-col">
          <span className="font-semibold text-white">Credit Card (Mock Payment)</span>
          <span className="text-[10px] text-slate-500">Your details are processed through a mock gateway.</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-300">Name on Card</label>
        <input 
          type="text" 
          placeholder="John Doe" 
          {...register('cardName')}
          className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
        />
        {errors.cardName && <p className="text-[10px] text-red-400 mt-1">{errors.cardName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-300">Card Number</label>
        <input 
          type="text" 
          placeholder="1234567890123456" 
          maxLength={16}
          {...register('cardNumber')}
          className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
        />
        {errors.cardNumber && <p className="text-[10px] text-red-400 mt-1">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">Expiration Date</label>
          <input 
            type="text" 
            placeholder="MM/YY" 
            maxLength={5}
            {...register('expiry')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.expiry && <p className="text-[10px] text-red-400 mt-1">{errors.expiry.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-300">CVV</label>
          <input 
            type="password" 
            placeholder="123" 
            maxLength={3}
            {...register('cvv')}
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
          />
          {errors.cvv && <p className="text-[10px] text-red-400 mt-1">{errors.cvv.message}</p>}
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="glow-btn mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Processing Payment...' : 'Complete Payment'}
      </button>
    </form>
  );
}
