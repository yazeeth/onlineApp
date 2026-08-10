import api from "./axios";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product.types";

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data.products;
  },

  getAllProductsForAdmin: async (): Promise<Product[]> => {
    const response = await api.get("/products/admin/all");
    return response.data.products;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  uploadProductImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const response = await api.post("/products/upload-image", formData);
    return response.data.url;
  },

  updateProduct: async (
    id: number,
    data: UpdateProductRequest,
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    return productApi.archiveProduct(id);
  },

  archiveProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  restoreProduct: async (id: number) => {
    const response = await api.patch(`/products/${id}/restore`);
    return response.data;
  },

  permanentlyDeleteProduct: async (id: number, password: string) => {
    const response = await api.delete(`/products/${id}/permanent`, {
      data: { password },
    });
    return response.data;
  },
};