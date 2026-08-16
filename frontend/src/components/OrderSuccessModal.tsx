import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../lib/formatters';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Package, 
  Truck,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
  const formattedDate = estimatedDeliveryDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden z-10 text-gray-900 p-6 sm:p-10 my-8"
      >
        {/* Top Success Badge */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-semibold text-[#0066CC] tracking-wider mb-1">
            Pedido Confirmado com Sucesso
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Obrigado pela sua compra.
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md">
            Enviamos o comprovante fiscal detalhado com o código de rastreio para{' '}
            <span className="text-gray-900 font-semibold">{order.customerEmail}</span>
          </p>

          <div className="mt-4 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 font-mono text-xs text-gray-700">
            Código do Pedido: <strong className="text-gray-900">{order.order_id || order.id}</strong>
          </div>
        </div>

        {/* Order Details */}
        <div className="py-6 space-y-4 text-xs">
          {/* Estimated Delivery */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FBFBFD] border border-gray-200/80">
            <Calendar className="w-5 h-5 text-[#0066CC] flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Previsão de Entrega Expressa</p>
              <p className="text-gray-500 capitalize">{formattedDate}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FBFBFD] border border-gray-200/80">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Entregar em</p>
              <p className="text-gray-500">
                {order.shippingAddress.street}, {order.shippingAddress.number}{' '}
                {order.shippingAddress.complement ? `(${order.shippingAddress.complement})` : ''} - {order.shippingAddress.city}/{order.shippingAddress.state}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="pt-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Itens do Pedido ({order.items.length})
            </h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBFBFD] border border-gray-200/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-gray-200/60"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.quantity}x {item.color ? `• ${item.color}` : ''} {item.storage ? `• ${item.storage}` : ''} {item.size ? `• ${item.size}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-gray-900 font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Desconto Especial</span>
                <span className="font-mono">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frete Expresso</span>
              <span className="text-emerald-600 font-semibold">Grátis</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-extrabold text-gray-900">
              <span>Total Pago</span>
              <span className="font-mono">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            id="btn-order-success-continue"
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continuar Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
