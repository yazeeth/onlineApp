import api from "./axios";
import type { Order, UpdateOrderStatusRequest } from "../types/order.types";

export const orderApi = {
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateOrderStatusRequest,
  ) => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },
};