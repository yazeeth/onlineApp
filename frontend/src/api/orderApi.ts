import api from "./axios";
import type { Order, UpdateOrderStatusRequest } from "../types/order.types";

export const orderApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  getAllOrdersAdmin: async (): Promise<Order[]> => {
    const response = await api.get("/orders/admin/all");
    return response.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: number) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateOrderStatusRequest,
  ) => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },

  createOrder: async (data: { addressId: number; paymentMethod: string }) => {
    const response = await api.post("/orders/checkout", data);
    return response.data;
  },
};