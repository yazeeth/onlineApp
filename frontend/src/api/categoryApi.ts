import api from "./axios";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category.types";

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  updateCategory: async (
    id: number,
    data: UpdateCategoryRequest,
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};