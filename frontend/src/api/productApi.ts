import api from "./axios";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product.types";

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: UpdateProductRequest,
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};