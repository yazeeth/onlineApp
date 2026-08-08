import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../api/paymentApi";
import type { UpdatePaymentStatusRequest } from "../types/payment.types";

export const usePayments = (orderId?: number) => {
  const queryClient = useQueryClient();

  const paymentQuery = useQuery({
    queryKey: ["payment", orderId],
    queryFn: () => paymentApi.getPaymentByOrder(orderId as number),
    enabled: Boolean(orderId),
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdatePaymentStatusRequest;
    }) => paymentApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", orderId] });
    },
  });

  return {
    payment: paymentQuery.data,
    isLoading: paymentQuery.isLoading,
    error: paymentQuery.error,
    updateStatus,
  };
};