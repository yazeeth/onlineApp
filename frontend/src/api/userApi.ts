import api from "./axios";
import type { RegisterRequest, User, UpdateUserRoleRequest } from "../types/user.types";

export const userApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/users/profile");
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
};