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
        setAuth(data.user, data.accessToken, data.refreshToken);
      }
    },
  });

  const login = (
    data: LoginRequest,
    options?: {
      onSuccess?: (user: NonNullable<ReturnType<typeof authApi.login> extends Promise<infer T> ? T extends { user?: infer U } ? U : never : never>) => void;
    },
  ) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.user && options?.onSuccess) {
          options.onSuccess(response.user);
        }
      },
    });
  };

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => {
      clearAuth();
    },
  });

  return {
    user,
    login,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
  };
};