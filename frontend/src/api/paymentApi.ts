import api from "./axios";
import type { Payment, UpdatePaymentStatusRequest } from "../types/payment.types";

export const paymentApi = {
  getPaymentByOrder: async (orderId: number): Promise<Payment> => {
    const response = await api.get(`/payments/${orderId}`);
    return response.data;
  },

  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get("/payments/admin/all");
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdatePaymentStatusRequest,
  ) => {
    const response = await api.put(`/payments/${id}/status`, data);
    return response.data;
  },
};