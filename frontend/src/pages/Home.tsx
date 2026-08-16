import React, { useState } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES_LIST } from '../data/fallbackProducts';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/formatters';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Heart,
  Dumbbell,
  Search,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  UserPlus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  products: Product[];
  isLoading: boolean;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenProductDetail: (product: Product) => void;
  onNavigateToAdmin: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Todos': <Sparkles className="w-3.5 h-3.5" />,
  'Eletrônicos & Tech': <Laptop className="w-3.5 h-3.5" />,
  'Moda & Vestuário': <Shirt className="w-3.5 h-3.5" />,
  'Casa & Decoração': <HomeIcon className="w-3.5 h-3.5" />,
  'Beleza & Cuidados': <Heart className="w-3.5 h-3.5" />,
  'Esportes & Fitness': <Dumbbell className="w-3.5 h-3.5" />,
};

export const Home: React.FC<HomeProps> = ({
  products,
  isLoading,
  activeCategory,
  onSelectCategory,
  onOpenProductDetail,
  onNavigateToAdmin,
  searchQuery = '',
  onSearchChange,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Real-time product search and filter
  const effectiveSearch = searchQuery.trim().toLowerCase();

  const sortedProducts = [...products]
    .filter(p => {
      if (!effectiveSearch) return true;
      return (
        p.name.toLowerCase().includes(effectiveSearch) ||
        p.description.toLowerCase().includes(effectiveSearch) ||
        p.category.toLowerCase().includes(effectiveSearch) ||
        (p.brand && p.brand.toLowerCase().includes(effectiveSearch)) ||
        (p.tag && p.tag.toLowerCase().includes(effectiveSearch))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  // Featured flagship product for hero
  const heroFlagship = products.find(p => p.isFeatured) || products[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 pb-20 font-montserrat">
      {/* Hero Showcase: Senior Enterprise Clean */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200/80 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9FAFB] border border-gray-200/80 shadow-2xs text-xs font-medium text-gray-800">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span className="font-medium">Curadoria Premium Multinicho</span>
              </div>

              {/* Montserrat Bold (700) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.12]">
                A simplicidade de comprar com elegância.
              </h1>

              {/* Montserrat Regular (400) */}
              <p className="text-base sm:text-lg font-normal text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Curadoria exclusiva de produtos com entrega rápida e pagamento seguro.
              </p>

              {/* Action Buttons: SemiBold (600) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#vitrine-produtos"
                  className="px-6 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {isAuthenticated ? (
                  <button
                    onClick={onNavigateToAdmin}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold border border-gray-200/80 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-gray-900" />
                    <span>Cadastrar Produto</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold border border-gray-200/80 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-gray-900" />
                    <span>Criar Conta</span>
                  </button>
                )}
              </div>

              {/* Value Props Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/60 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600">Frete Expresso</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-900 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600">Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600">Troca Garantida</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Feature or Empty State Promo */}
            {heroFlagship ? (
              <div className="lg:col-span-5">
                <div
                  onClick={() => onOpenProductDetail(heroFlagship)}
                  className="relative group bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[11px] font-semibold bg-black text-white shadow-2xs">
                    ★ Destaque
                  </div>

                  <div className="aspect-square bg-[#F9FAFB] rounded-xl p-6 flex items-center justify-center overflow-hidden mb-6">
                    {heroFlagship.image_url ? (
                      <img
                        src={heroFlagship.image_url}
                        alt={heroFlagship.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-300 stroke-1" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      {heroFlagship.category} {heroFlagship.brand ? `• ${heroFlagship.brand}` : ''}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                      {heroFlagship.name}
                    </h3>
                    <p className="text-xs font-normal text-gray-500 line-clamp-2 leading-relaxed">
                      {heroFlagship.description}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 font-mono">
                        {formatCurrency(heroFlagship.price)}
                      </span>
                      <span className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold group-hover:bg-gray-800 transition-colors">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200/60 flex items-center justify-center mx-auto text-gray-900 shadow-2xs">
                    <Package className="w-8 h-8 text-gray-800 stroke-1" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Catálogo Pronto para Produtos
                    </h3>
                    <p className="text-xs font-normal text-gray-500 mt-1 max-w-xs mx-auto">
                      Nenhum produto cadastrado no momento. Adicione itens reais via upload de fotos ou links para preencher sua vitrine.
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToAdmin}
                    className="w-full py-3 px-4 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    + Cadastrar Primeiro Produto
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Main Vitrine Showcase Section */}
      <section id="vitrine-produtos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Category Pills Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Explore por Categoria
              </h2>
              <p className="text-xs sm:text-sm font-normal text-gray-500 mt-1">
                Selecione um nicho para visualizar os produtos disponíveis
              </p>
            </div>

            {/* Quick Search & Sort Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* In-page text search synced with Navbar real-time search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por nome, marca ou nicho..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-gray-200/80 text-xs font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 rounded-full"
                    title="Limpar busca"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-full bg-white border border-gray-200/80 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="rating">Melhor Avaliação</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Search Results Indicator Banner */}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center justify-between bg-white border border-gray-200/80 px-4 py-2.5 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">
                  Exibindo <strong>{sortedProducts.length}</strong> resultado(s) para:
                </span>
                <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 font-semibold text-gray-900">
                  "{searchQuery}"
                </span>
              </div>
              <button
                onClick={() => onSearchChange?.('')}
                className="text-xs font-medium text-gray-600 hover:text-black hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpar busca</span>
              </button>
            </div>
          )}

          {/* Category Pills Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  id={`filter-pill-${cat.id}`}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-200/80'
                  }`}
                >
                  {CATEGORY_ICONS[cat.name] || <Sparkles className="w-3.5 h-3.5" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid or Skeleton Loader */}
        {isLoading ? (
          /* Skeleton Loaders */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-4 animate-pulse shadow-sm"
              >
                <div className="aspect-square bg-gray-100 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-md w-1/3" />
                  <div className="h-4 bg-gray-100 rounded-md w-4/5" />
                  <div className="h-3 bg-gray-100 rounded-md w-2/3" />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div className="h-5 bg-gray-100 rounded-md w-20" />
                  <div className="h-8 bg-gray-100 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs font-normal text-gray-500 mt-1">
              Não encontramos produtos para os critérios de busca selecionados.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => {
                  onSelectCategory('Todos');
                  onSearchChange?.('');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-xs font-semibold text-white transition-colors"
              >
                + Cadastrar Produto
              </button>
            </div>
          </div>
        ) : (
          /* Real Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={onOpenProductDetail}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

