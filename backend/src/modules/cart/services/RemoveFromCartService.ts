import { ICartRepository } from "../repositories/ICartRepository.js";

interface Request {
  id: string;
  user_id: string;
}

export class RemoveFromCartService {
  constructor(private cartRepository: ICartRepository) {}

  async execute({ id, user_id }: Request): Promise<void> {
    await this.cartRepository.removeItem(id, user_id);
  }
}
