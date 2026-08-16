import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { syncCartApi } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  lastCompletedOrder: Order | null;
  couponCode: string;
  discountPercentage: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setLastCompletedOrder: (order: Order | null) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedStorage?: string, selectedSize?: string) => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedStorage?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string | number, selectedColor?: string, selectedStorage?: string, selectedSize?: string) => void;
  removeItem: (productId: string | number, selectedColor?: string, selectedStorage?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string | number, quantity: number, selectedColor?: string, selectedStorage?: string, selectedSize?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shipping: number;
  total: number;
  totalItems: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart') || localStorage.getItem('ecommerce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const { showToast } = useToast();

  const freeShippingThreshold = 500; // R$ 500 para frete grátis

  // Save cart to local storage and sync with backend with complete error handling
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(items));
      localStorage.setItem('ecommerce_cart', JSON.stringify(items));
      
      // Async sync with API: catch 401, 500, or any failure and keep cart in localStorage safely
      syncCartApi(items).catch((err) => {
        try {
          localStorage.setItem('aura_cart', JSON.stringify(items));
          localStorage.setItem('ecommerce_cart', JSON.stringify(items));
        } catch (_) {}
      });
    } catch (_) {}
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedStorage?: string,
    selectedSize?: string
  ) => {
    const color = selectedColor || product.colors?.[0]?.name || undefined;
    const storage = selectedStorage || product.storageOptions?.[0] || undefined;
    const size = selectedSize || product.sizes?.[0] || undefined;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          String(item.product.id) === String(product.id) &&
          item.selectedColor === color &&
          item.selectedStorage === storage &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, quantity, selectedColor: color, selectedStorage: storage, selectedSize: size }];
      }
    });
  };

  const removeFromCart = (
    productId: string | number,
    selectedColor?: string,
    selectedStorage?: string,
    selectedSize?: string
  ) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            String(item.product.id) === String(productId) &&
            (!selectedColor || item.selectedColor === selectedColor) &&
            (!selectedStorage || item.selectedStorage === selectedStorage) &&
            (!selectedSize || item.selectedSize === selectedSize)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string | number,
    quantity: number,
    selectedColor?: string,
    selectedStorage?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedStorage, selectedSize);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (
          String(item.product.id) === String(productId) &&
          (!selectedColor || item.selectedColor === selectedColor) &&
          (!selectedStorage || item.selectedStorage === selectedStorage) &&
          (!selectedSize || item.selectedSize === selectedSize)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'APPLE10' || cleanCode === 'AURA10') {
      setCouponCode(cleanCode);
      setDiscountPercentage(10);
      return true;
    }
    if (cleanCode === 'PRO20' || cleanCode === 'VIP20') {
      setCouponCode(cleanCode);
      setDiscountPercentage(20);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 29.90;
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        isCheckoutOpen,
        lastCompletedOrder,
        couponCode,
        discountPercentage,
        openCart,
        closeCart,
        toggleCart,
        openCheckout,
        closeCheckout,
        setLastCompletedOrder,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shipping,
        total,
        totalItems,
        freeShippingThreshold,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
