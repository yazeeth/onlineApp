export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image?: string | null;
  } | null;
}

export interface Order {
  id: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
  };
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