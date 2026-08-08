import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import type { LoginRequest } from "../types/auth.types";

export const useAuth = () => {
  const { setAuth, clearAuth, user } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      if (data.user) {
        setAuth(
          data.user,
          data.accessToken,
          data.refreshToken,
        );
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => {
      clearAuth();
    },
  });

  return {
    user,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
  };
};