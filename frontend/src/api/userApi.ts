import api from "./axios";
import type { RegisterRequest, User, UpdateUserRoleRequest } from "../types/user.types";

export const userApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/users/profile");
    return response.data.user;
  },

  updateProfile: async (data: { name?: string; email?: string; phone?: string }) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.patch("/users/password", data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  updateRole: async (id: number, data: UpdateUserRoleRequest) => {
    const response = await api.patch(`/users/${id}/role`, data);
    return response.data;
  },

  updateUser: async (
    id: number,
    data: { name: string; email: string; phone: string },
  ) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};