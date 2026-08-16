import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../data/fallbackProducts';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  Grid3X3, 
  Layers,
  SearchX 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BentoProductGridProps {
  products: Product[];
  isLoading: boolean;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const BentoProductGrid: React.FC<BentoProductGridProps> = ({
  products,
  isLoading,
  activeCategory,
  onSelectCategory,
  onOpenProductDetail,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <section id="product-bento-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#0066CC] text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Catálogo Completo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Projetado para impressionar.
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1 max-w-xl">
            Explore a mais refinada linha de produtos com engenharia de ponta e materiais nobres.
          </p>
        </div>

        {/* Filter Controls & Sort Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-2xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        {CATEGORIES_LIST.map((category) => {
          const isActive = activeCategory === category.name;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-4 animate-pulse shadow-sm"
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-xl w-full" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-md w-1/3" />
                <div className="h-4 bg-gray-100 rounded-md w-4/5" />
                <div className="h-3 bg-gray-100 rounded-md w-2/3" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="h-5 bg-gray-100 rounded-md w-20" />
                <div className="h-8 bg-gray-100 rounded-full w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200/80 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Nenhum produto encontrado
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            Não encontramos itens nesta categoria no momento.
          </p>
          <button
            onClick={() => onSelectCategory('Todos')}
            className="mt-4 px-5 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all"
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenProductDetail}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
