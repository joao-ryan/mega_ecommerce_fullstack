import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/formatters';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  Lock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FREE_SHIPPING_THRESHOLD = 500;

export const SlideOverCart: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    openCheckout
  } = useCart();

  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = couponCode.trim().toUpperCase();

    if (normalized === 'APPLE10' || normalized === 'AURA10' || normalized === 'ECOMMERCE10') {
      const discount = subtotal * 0.10;
      setAppliedDiscount(discount);
      setCouponSuccess('Cupom ECOMMERCE10 de 10% OFF aplicado!');
      showToast('Cupom de 10% OFF aplicado com sucesso!', 'success');
    } else if (normalized === 'BEMVINDO') {
      const discount = 50;
      setAppliedDiscount(discount);
      setCouponSuccess('Cupom BEMVINDO de R$ 50,00 aplicado!');
      showToast('Cupom de desconto aplicado!', 'success');
    } else {
      showToast('Cupom inválido. Tente "ECOMMERCE10" ou "BEMVINDO"', 'error');
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showToast('Por favor, faça login ou crie sua conta para finalizar o pedido.', 'info');
      openAuthModal('login');
      return;
    }
    closeCart();
    openCheckout();
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-montserrat">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-white border-l border-gray-200/80 shadow-2xl flex flex-col justify-between text-gray-900"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Sua Sacola
              </h2>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {items.reduce((sum, item) => sum + item.quantity, 0)} itens
              </span>
            </div>

            <button
              id="btn-close-cart-slideover"
              onClick={closeCart}
              className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F9FAFB] border-b border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-gray-600 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-600 font-semibold">Parabéns! Você ganhou Frete Grátis</strong>
                ) : (
                  <span>
                    Faltam <strong>{formatCurrency(remainingForFreeShipping)}</strong> para frete grátis
                  </span>
                )}
              </span>
              <span className="font-semibold text-gray-900 font-mono text-[11px]">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Sua sacola está vazia</h3>
                <p className="text-xs font-normal text-gray-500 max-w-xs mx-auto">
                  Explore nossas coleções multinicho e adicione seus itens favoritos.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedStorage || ''}-${item.selectedSize || ''}-${index}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-[#F9FAFB] border border-gray-200/80 hover:border-gray-300 transition-all"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-contain rounded-xl bg-white p-2 border border-gray-200/60 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-gray-900 truncate leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedStorage, item.selectedSize)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] font-normal text-gray-500 mt-0.5">
                        {item.selectedColor ? `Cor: ${item.selectedColor} ` : ''}
                        {item.selectedStorage ? `• ${item.selectedStorage} ` : ''}
                        {item.selectedSize ? `• Tam: ${item.selectedSize}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-gray-200 rounded-full p-0.5 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedStorage, item.selectedSize)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-xs text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedStorage, item.selectedSize)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-sm text-gray-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Financials & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F9FAFB] border-t border-gray-200/80 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cupom (Ex: ECOMMERCE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {couponSuccess}
                </p>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Desconto do Cupom</span>
                    <span className="font-mono">-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete Estimado</span>
                  <span className="text-emerald-600 font-semibold font-mono">
                    {remainingForFreeShipping === 0 ? 'Grátis' : 'R$ 29,90'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-bold text-gray-900">
                  <span>Total Estimado</span>
                  <span className="font-mono">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="btn-cart-proceed-checkout"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-black hover:bg-gray-800 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isAuthenticated
                    ? `Finalizar Compra • ${formatCurrency(finalTotal)}`
                    : `Entrar para Finalizar Compra`}
                </span>
              </button>

              <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
                Checkout criptografado e seguro
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

