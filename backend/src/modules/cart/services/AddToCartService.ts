import { AppError } from "../../../shared/errors/AppError.js";
import { ICartRepository, CartItem } from "../repositories/ICartRepository.js";

interface Request {
  user_id: string;
  variant_id: string;
  quantity: number;
}

export class AddToCartService {
  constructor(private cartRepository: ICartRepository) {}

  async execute({ user_id, variant_id, quantity }: Request): Promise<CartItem> {
    if (!variant_id || quantity <= 0) {
      throw new AppError(
        "Variante inválida ou quantidade deve ser maior que zero.",
      );
    }

    // Se o item já existir no carrinho, apenas soma a quantidade!
    const existingItem = await this.cartRepository.findByUserAndVariant(
      user_id,
      variant_id,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await this.cartRepository.updateQuantity(existingItem.id, newQuantity);
      return { ...existingItem, quantity: newQuantity };
    }

    // Se não existir, cria a nova linha no banco
    return await this.cartRepository.addItem({ user_id, variant_id, quantity });
  }
}
