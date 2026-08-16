export type NicheCategory = 
  | 'Eletrônicos & Tech'
  | 'Moda & Vestuário'
  | 'Casa & Decoração'
  | 'Beleza & Cuidados'
  | 'Esportes & Fitness';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  itemCount?: number;
}

export interface Product {
  id: string | number;
  _id?: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image_url: string;
  images?: string[];
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  tag?: string;
  colors?: { name: string; hex: string; image?: string }[];
  storageOptions?: string[];
  sizes?: string[];
  specs?: { [key: string]: string };
  highlights?: string[];
  createdAt?: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number | string;
  stock: number | string;
  image_url: string;
  description: string;
  brand?: string;
  tag?: string;
  isFeatured?: boolean;
}

export interface User {
  id: string | number;
  clerkId?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  token?: string;
}

export interface UserSyncPayload {
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface UserSyncResponse {
  success?: boolean;
  message?: string;
  user?: User;
  data?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedSize?: string;
}

export interface OrderItem {
  product_id: string | number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  color?: string;
  storage?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id?: string;
  order_id?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'apple_pay' | 'credit_card' | 'pix';
  shippingAddress: ShippingAddress;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'delivered';
  createdAt?: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  token_type?: string;
  message?: string;
  status?: string;
}

export interface ApiResponse<T> {
  data?: T;
  products?: T;
  product?: T;
  categories?: T;
  message?: string;
  status?: string;
  count?: number;
  total?: number;
}

