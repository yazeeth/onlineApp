import api from "./axios";
import type {
  Cart,
  AddCartItemRequest,
  UpdateCartItemRequest,
} from "../types/cart.types";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get("/cart");
    return response.data;
  },

  addItem: async (data: AddCartItemRequest) => {
    const response = await api.post("/cart/add", data);
    return response.data;
  },

  updateItem: async (
    id: number,
    data: UpdateCartItemRequest,
  ) => {
    const response = await api.put(`/cart/item/${id}`, data);
    return response.data;
  },

  removeItem: async (id: number) => {
    const response = await api.delete(`/cart/item/${id}`);
    return response.data;
  },
};