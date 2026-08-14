export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  product_name?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "PENDING" | "PAID" | "CANCELED";
  created_at?: Date;
  items?: OrderItem[];
}

export interface CreateOrderDTO {
  user_id: string;
  total_amount: number;
  items: {
    variant_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface IOrdersRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  findById(id: string, user_id: string): Promise<Order | null>;
  findByUser(user_id: string): Promise<Order[]>;
}
