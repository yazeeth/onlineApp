export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  items: OrderItem[];
  address?: {
    id: number;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  createdAt?: string;
  updatedAt?: string;
  payment?: {
    id: number;
    orderId: number;
    amount: number;
    method: "COD" | "BANK_TRANSFER";
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    createdAt: string;
  };
}

export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: "COD" | "BANK_TRANSFER";
}

export interface UpdateOrderStatusRequest {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}