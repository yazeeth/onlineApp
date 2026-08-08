import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { toast } from "react-toastify";
import type { AddCartItemRequest, UpdateCartItemRequest } from "../types/cart.types";

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const addItem = useMutation({
    mutationFn: (data: AddCartItemRequest) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart successfully!");
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCartItemRequest }) =>
      cartApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItem = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    addItem,
    updateItem,
    removeItem,
  };
};