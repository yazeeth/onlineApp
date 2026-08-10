export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image?: string | null;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}