import React, { useState, useRef, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Product, Category } from '../types';
import { CATEGORIES_LIST } from '../data/fallbackProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/formatters';
import { isClerkEnabled } from '../lib/clerkConfig';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  PlusCircle,
  Sparkles,
  X,
  ChevronRight,
  LogOut,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
  onOpenProductDetail: (product: Product) => void;
  currentView: 'store' | 'admin';
  onToggleAdmin: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const ClerkAuthControls: React.FC<{
  isAuthenticated: boolean;
  user: any;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (val: boolean) => void;
  currentView: string;
  onToggleAdmin: () => void;
  logout: () => void;
}> = ({
  isAuthenticated,
  user,
  isUserMenuOpen,
  setIsUserMenuOpen,
  currentView,
  onToggleAdmin,
  logout,
}) => {
  return (
    <div className="flex items-center">
      <SignedIn>
        <div className="flex items-center gap-2 pl-1">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-gray-200 hover:scale-105 transition-transform"
              }
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        {isAuthenticated ? (
          <div className="relative">
            <button
              id="btn-nav-user-profile"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline truncate max-w-[90px]">
                {user?.name?.split(' ')[0] || 'Usuário'}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-200/80 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  {user?.role === 'admin' && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-[#0066CC] border border-blue-100">
                      Administrador
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (currentView !== 'admin') onToggleAdmin();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left"
                >
                  <PlusCircle className="w-4 h-4 text-[#0066CC]" />
                  <span>Cadastrar Produtos</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <SignInButton mode="modal">
            <button
              id="btn-nav-login-open"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Entrar via Clerk"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          </SignInButton>
        )}
      </SignedOut>
    </div>
  );
};
export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  products,
  onOpenProductDetail,
  currentView,
  onToggleAdmin,
  searchQuery = '',
  onSearchChange,
}) => {
  const { totalItems, toggleCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        } else if (mobileSearchInputRef.current) {
          mobileSearchInputRef.current.focus();
        }
      }
      if (e.key === 'Escape') {
        if (searchQuery) {
          onSearchChange?.('');
        }
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, onSearchChange]);

  const filteredSearchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
            
            {/* Logo & Brand ("E-commerce") */}
            <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
              <button
                id="btn-nav-brand-logo"
                onClick={() => {
                  if (currentView === 'admin') onToggleAdmin();
                  onSelectCategory('Todos');
                  if (searchQuery) onSearchChange?.('');
                }}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform duration-200 group-hover:scale-105">
                  E
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-tight text-gray-900 leading-none block">
                    E-commerce
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Store & Catalog
                  </span>
                </div>
              </button>

              {/* Desktop Primary Navigation */}
              <nav className="hidden xl:flex items-center gap-1">
                <button
                  id="nav-link-inicio"
                  onClick={() => {
                    if (currentView === 'admin') onToggleAdmin();
                    onSelectCategory('Todos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'store' && activeCategory === 'Todos' && !searchQuery
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Início
                </button>

                <a
                  id="nav-link-produtos"
                  href="#vitrine-produtos"
                  onClick={() => {
                    if (currentView === 'admin') onToggleAdmin();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  Produtos
                </a>

                <button
                  id="nav-link-cadastrar"
                  onClick={() => {
                    if (currentView !== 'admin') onToggleAdmin();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentView === 'admin'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Cadastrar Produto
                </button>
              </nav>
            </div>

            {/* Central Real-Time Search Input Field (Senior Enterprise Clean) */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2">
              <div className="relative w-full flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none transition-colors" />
                <input
                  id="navbar-product-search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar produtos em tempo real..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-100/90 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-2xs transition-all"
                />
                
                <div className="absolute right-2.5 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      id="btn-navbar-clear-search"
                      onClick={() => onSearchChange?.('')}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                      title="Limpar busca (Esc)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-gray-400 border border-gray-200 shadow-2xs">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Admin Quick Action Button */}
              <button
                id="btn-nav-admin-toggle"
                onClick={onToggleAdmin}
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-2xs ${
                  currentView === 'admin'
                    ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{currentView === 'admin' ? 'Ver Loja' : '+ Cadastrar'}</span>
              </button>

              {/* Authentication Area: Clerk or Native Auth */}
              {isClerkEnabled ? (
                <ClerkAuthControls
                  isAuthenticated={isAuthenticated}
                  user={user}
                  isUserMenuOpen={isUserMenuOpen}
                  setIsUserMenuOpen={setIsUserMenuOpen}
                  currentView={currentView}
                  onToggleAdmin={onToggleAdmin}
                  logout={logout}
                  openAuthModal={() => openAuthModal('login')}
                />
              ) : (
                <div className="flex items-center">
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        id="btn-nav-user-profile"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="hidden sm:inline truncate max-w-[90px]">
                          {user?.name?.split(' ')[0] || 'Usuário'}
                        </span>
                      </button>

                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-200/80 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-3 py-2 border-b border-gray-100 mb-1">
                            <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                            {user?.role === 'admin' && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-[#0066CC] border border-blue-100">
                                Administrador
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              if (currentView !== 'admin') onToggleAdmin();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left"
                          >
                            <PlusCircle className="w-4 h-4 text-[#0066CC]" />
                            <span>Cadastrar Produtos</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair da Conta</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      id="btn-nav-login-open"
                      onClick={() => openAuthModal('login')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Entrar ou Cadastrar"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Entrar</span>
                    </button>
                  )}
                </div>
              )}

              {/* Cart Drawer Trigger Button */}
              <button
                id="btn-nav-cart-toggle"
                onClick={toggleCart}
                className="relative p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition-all active:scale-95"
                title="Sacola de Compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Real-Time Search Bar Row */}
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                id="navbar-mobile-product-search"
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Buscar produtos em tempo real..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-100/90 focus:bg-white border border-transparent focus:border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  id="btn-navbar-mobile-clear-search"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-700"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200/80 shadow-2xl overflow-hidden z-10 p-4"
            >
              {/* Search Bar Input */}
              <div className="relative flex items-center border-b border-gray-100 pb-3">
                <Search className="w-5 h-5 text-gray-400 absolute left-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquisar por nome, nicho, marca ou características..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.('')}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 absolute right-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Results or Category Suggestions */}
              <div className="mt-4 max-h-96 overflow-y-auto pr-1">
                {searchQuery.trim() === '' ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-gray-400 mb-3">Navegue pelas categorias rápidas:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {CATEGORIES_LIST.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            if (currentView === 'admin') onToggleAdmin();
                            onSelectCategory(cat.name);
                            setIsSearchOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : filteredSearchResults.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    Nenhum produto encontrado para "<strong className="text-gray-700">{searchQuery}</strong>".
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2">
                      Resultados ({filteredSearchResults.length})
                    </p>
                    {filteredSearchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onOpenProductDetail(product);
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 object-contain rounded-lg bg-gray-100 p-1 flex-shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-[10px] font-semibold text-[#0066CC] uppercase tracking-wider block">
                              {product.category}
                            </span>
                            <p className="text-xs font-bold text-gray-900 truncate group-hover:text-black">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-gray-500 font-mono">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

