/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Product, Order } from './types';
import { getProducts } from './services/api';
import { FALLBACK_PRODUCTS } from './data/fallbackProducts';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AdminProductCreate } from './pages/AdminProductCreate';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SlideOverCart } from './components/SlideOverCart';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ClerkSyncHandler } from './components/ClerkSyncHandler';
import { Footer } from './components/Footer';

function MainCommerceApp() {
  const { isCheckoutOpen, closeCheckout } = useCart();

  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [initialEditProduct, setInitialEditProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load products from centralized REST API
  const loadProducts = useCallback(async (cat = 'Todos') => {
    setIsLoading(true);
    try {
      const data = await getProducts(cat);
      setProducts(data);
    } catch (err) {
      console.warn('Failed to load products from API', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setIsOrderSuccessOpen(true);
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev.filter(p => String(p.id) !== String(newProduct.id))]);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) => prev.map(p => String(p.id) === String(updatedProduct.id) ? updatedProduct : p));
  };

  const handleProductDeleted = (deletedId: string | number) => {
    setProducts((prev) => prev.filter(p => String(p.id) !== String(deletedId)));
  };

  const handleEditProductFromStore = (product: Product) => {
    setInitialEditProduct(product);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAdmin = () => {
    setCurrentView((prev) => {
      if (prev === 'admin') {
        setInitialEditProduct(null);
        return 'store';
      }
      return 'admin';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (currentView === 'admin' && query.trim() !== '') {
      setInitialEditProduct(null);
      setCurrentView('store');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-gray-900 selection:bg-black selection:text-white flex flex-col justify-between font-sans antialiased">
      <div>
        {/* Navigation Bar (Apple Light Clean) */}
        <Navbar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (currentView === 'admin') {
              setInitialEditProduct(null);
              setCurrentView('store');
            }
          }}
          products={products}
          onOpenProductDetail={handleOpenDetail}
          currentView={currentView}
          onToggleAdmin={handleToggleAdmin}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* View Switcher: Storefront vs Admin Product Management */}
        {currentView === 'store' ? (
          <Home
            products={products}
            isLoading={isLoading}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            onOpenProductDetail={handleOpenDetail}
            onNavigateToAdmin={() => {
              setInitialEditProduct(null);
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        ) : (
          <AdminProductCreate
            onBackToStore={() => {
              setInitialEditProduct(null);
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onProductCreated={handleProductCreated}
            onProductUpdated={handleProductUpdated}
            onProductDeleted={handleProductDeleted}
            initialEditProduct={initialEditProduct}
          />
        )}
      </div>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView === 'admin') {
            setInitialEditProduct(null);
            setCurrentView('store');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToAdmin={() => {
          setInitialEditProduct(null);
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onEditProduct={handleEditProductFromStore}
        onDeleteProduct={handleProductDeleted}
      />

      <SlideOverCart />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal />

      <OrderSuccessModal
        order={completedOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ClerkSyncHandler />
        <CartProvider>
          <MainCommerceApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
