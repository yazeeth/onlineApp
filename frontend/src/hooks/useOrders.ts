import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/orderApi";
import { toast } from "react-toastify";
import type { UpdateOrderStatusRequest } from "../types/order.types";

export const useOrders = (id?: number) => {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrder(id as number),
    enabled: Boolean(id),
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
    enabled: !id,
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusRequest;
    }) => orderApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: (orderId: number) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Unable to cancel order.");
    },
  });

  const createOrder = useMutation({
    mutationFn: (data: { addressId: number; paymentMethod: string }) =>
      orderApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(
        "Order placed successfully! Someone from our store will reach out to you regarding delivery.",
      );
    },
  });

  return {
    order: orderQuery.data,
    orders: ordersQuery.data,
    isLoading: id ? orderQuery.isLoading : ordersQuery.isLoading,
    error: id ? orderQuery.error : ordersQuery.error,
    updateStatus,
    cancelOrder,
    createOrder,
  };
};