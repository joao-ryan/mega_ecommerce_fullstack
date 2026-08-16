import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../lib/formatters';
import { Plus, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
}) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    showToast(`"${product.name}" adicionado à sacola!`, 'success');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer font-montserrat"
    >
      {/* Top Media / Photo Box: aspect-square */}
      <div className="relative aspect-square bg-[#F9FAFB] flex items-center justify-center p-6 overflow-hidden">
        {/* Category Tag & Featured Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {product.tag ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white shadow-xs">
              {product.tag}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white text-gray-700 border border-gray-200/80 shadow-2xs">
              {product.category}
            </span>
          )}
        </div>

        {product.isFeatured && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white shadow-2xs">
            ★ Destaque
          </span>
        )}

        {/* Product Image with Hover Zoom */}
        <img
          src={product.image_url}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quick View Overlay on Desktop Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-xs font-semibold text-gray-900 shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5" />
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Content & Information */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white space-y-3">
        <div>
          {/* Niche & Brand meta */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-medium text-gray-500 uppercase tracking-wider">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-gray-400 font-normal truncate max-w-[120px]">
                {product.brand}
              </span>
            )}
          </div>

          {/* Title: Montserrat SemiBold (600) */}
          <h3 className="text-sm font-semibold text-gray-900 tracking-tight group-hover:text-black line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Brief Description: Montserrat Regular (400) */}
          <p className="text-xs font-normal text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through block leading-none font-mono">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-base font-bold text-gray-900 font-mono tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            id={`btn-add-product-${product.id}`}
            type="button"
            onClick={handleQuickAdd}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 active:scale-95 text-white text-xs font-medium shadow-sm transition-all"
            title="Adicionar à Sacola"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Adicionar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

