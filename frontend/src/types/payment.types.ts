export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  method: "COD" | "BANK_TRANSFER";
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePaymentStatusRequest {
  status: "PENDING" | "PAID" | "FAILED";
}