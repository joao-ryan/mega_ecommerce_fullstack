import { Product, Category } from '../types';

export const CATEGORIES_LIST: Category[] = [
  {
    id: 'all',
    name: 'Todos',
    slug: 'todos',
    description: 'Catálogo completo de produtos.',
    icon: 'Sparkles',
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos & Tech',
    slug: 'eletronicos',
    description: 'Hardware avançado, dispositivos de precisão e áudio de alta fidelidade.',
    icon: 'Laptop',
  },
  {
    id: 'moda',
    name: 'Moda & Vestuário',
    slug: 'moda',
    description: 'Cortes minimalistas, tecidos nobres e design atemporal.',
    icon: 'Shirt',
  },
  {
    id: 'casa',
    name: 'Casa & Decoração',
    slug: 'casa',
    description: 'Design de interiores escandinavo, iluminação e ergonomia refinada.',
    icon: 'Home',
  },
  {
    id: 'beleza',
    name: 'Beleza & Cuidados',
    slug: 'beleza',
    description: 'Fórmulas botânicas, cuidados diários e tecnologia em autocuidado.',
    icon: 'Heart',
  },
  {
    id: 'esportes',
    name: 'Esportes & Fitness',
    slug: 'esportes',
    description: 'Equipamentos de alta performance, monitoramento e treino funcional.',
    icon: 'Dumbbell',
  },
];

// Sem produtos fictícios - Catálogo limpo para receber produtos reais da API e do cadastro
export const FALLBACK_PRODUCTS: Product[] = [];
