export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface IProductsRepository {
  findById(id: string): Promise<Product | null>;
  create(data: Omit<Product, "id">): Promise<Product>;
  updateStock(id: string, quantity: number): Promise<void>;
}
