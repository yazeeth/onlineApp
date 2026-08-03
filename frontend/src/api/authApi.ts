import api from "./axios";
import type { LoginRequest, LoginResponse, RefreshTokenRequest } from "../types/auth.types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    const response = await api.post("/auth/refresh", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
