'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/store/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import CartSummary from '@/components/cart/CartSummary';
import { MapPin, CreditCard, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, total, coupon, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [addressData, setAddressData] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Get user addresses
  const { data: profileRes } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => api.get(`/users/${user.id}`),
    enabled: !!user,
  });

  const addresses = profileRes?.data?.addresses || [];

  const handleAddressSubmit = (data) => {
    setAddressData(data);
    setSelectedAddressId('');
    setStep(2);
  };

  const handleSelectExistingAddress = (id) => {
    setSelectedAddressId(id);
    setAddressData(null);
    setStep(2);
  };

  const handlePaymentSubmit = async (cardData) => {
    try {
      const payload = {
        couponCode: coupon?.code,
      };

      if (selectedAddressId) {
        payload.addressId = selectedAddressId;
      } else {
        payload.address = addressData;
      }

      const res = await api.post('/orders', payload);
      if (res.success) {
        setCreatedOrder(res.data);
        clearCart();
        setStep(3);
        toast.success('Order checkout completed successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Checkout failed');
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <ShoppingBag className="w-10 h-10 text-slate-600 mb-4" />
        <h3 className="text-sm font-semibold text-slate-400">Checkout is empty</h3>
        <Link href="/products" className="text-xs text-violet-400 mt-2 hover:underline">
          Browse products to buy
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto w-full flex flex-col gap-10">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-6 text-xs max-w-lg mx-auto w-full">
        <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 1 ? 'border-violet-400 bg-violet-600/10' : 'border-slate-600'
          }`}>1</span>
          Shipping
        </div>
        <div className="h-[1px] bg-slate-800 flex-1"></div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 2 ? 'border-violet-400 bg-violet-600/10' : 'border-slate-600'
          }`}>2</span>
          Payment
        </div>
        <div className="h-[1px] bg-slate-800 flex-1"></div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
            step >= 3 ? 'border-violet-400 bg-violet-600/10' : 'border-slate-600'
          }`}>3</span>
          Receipt
        </div>
      </div>

      {step === 3 ? (
        /* Confirmation step */
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 bg-slate-900/20 border border-white/5 rounded-3xl p-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white tracking-tight">Order Placed Successfully!</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Thank you for your purchase. Your order has been placed. We've sent a confirmation email containing invoice summaries.
          </p>
          {createdOrder && (
            <div className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 mt-6 text-left flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID</span>
                <span className="font-mono font-bold text-white">{createdOrder.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Charged</span>
                <span className="font-bold text-violet-400">${createdOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-400">{createdOrder.status}</span>
              </div>
            </div>
          )}
          <Link 
            href="/orders"
            className="glow-btn mt-8 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Track My Orders
          </Link>
        </div>
      ) : (
        /* Form Steps */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
            {step === 1 ? (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  Shipping Address
                </h3>
                
                {addresses.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Use Saved Address</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() => handleSelectExistingAddress(addr.id)}
                          className="text-left p-4 bg-slate-950 border border-white/10 hover:border-violet-500/30 rounded-xl flex flex-col gap-1.5 text-xs transition-all"
                        >
                          <span className="font-bold text-slate-200">{addr.city}, {addr.state}</span>
                          <span className="text-slate-400">{addr.address}</span>
                          <span className="text-slate-500">{addr.country} - {addr.zip}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 my-4">
                      <div className="h-[1px] bg-slate-800 flex-1"></div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Or Add New</span>
                      <div className="h-[1px] bg-slate-800 flex-1"></div>
                    </div>
                  </div>
                )}
                
                <AddressForm onSubmit={handleAddressSubmit} />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-violet-400" />
                  Billing Payment
                </h3>
                <PaymentForm onSubmit={handlePaymentSubmit} />
                <button 
                  onClick={() => setStep(1)}
                  className="text-center text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Change Shipping Address
                </button>
              </div>
            )}
          </div>

          {/* Right Summary */}
          <div>
            <CartSummary showCheckoutBtn={false} />
          </div>
        </div>
      )}
    </div>
  );
}
