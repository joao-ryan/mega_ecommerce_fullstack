// Interface simples do Produto
export interface Product {
  id?: string | number;
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock?: number;
  created_at?: Date;
}

// DTO para criação de produtos
export interface CreateProductDTO {
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock?: number;
  category_id?: string;
}

// Contrato do Repositório de Produtos
export interface IProductsRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
