import { Link } from "react-router-dom";
import { useState } from "react";
import { useOrders } from "../hooks/useOrders";

export default function Orders() {
  const { orders, isLoading, error, cancelOrder } = useOrders();
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load orders.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded border p-4"
            >
              <h2 className="font-semibold">
                Order #{order.id}
              </h2>

              <p className="mt-2">
                Status: <span className="font-semibold">{order.status}</span>
              </p>

              <p>
                Total: ${order.totalAmount}
              </p>

              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Payment method</span>
                  <span className="font-semibold">
                    {order.payment?.method === "BANK_TRANSFER"
                      ? "Bank Transfer"
                      : order.payment?.method === "COD"
                        ? "Cash on Delivery"
                        : "Not available"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gray-500">Payment status</span>
                  <span
                    className={`font-semibold ${
                      order.payment?.status === "PAID"
                        ? "text-green-600"
                        : order.payment?.status === "FAILED"
                          ? "text-red-600"
                          : order.payment?.status === "REFUNDED"
                            ? "text-purple-600"
                            : "text-yellow-700"
                    }`}
                  >
                    {order.payment?.status ?? "PENDING"}
                  </span>
                </div>
              </div>

              <Link
                to={`/orders/${order.id}`}
                className="mt-3 inline-block rounded bg-black px-4 py-2 text-white"
              >
                View Details
              </Link>
              {order.status === "PENDING" && (
                <button
                  type="button"
                  disabled={cancellingOrderId === order.id || cancelOrder.isPending}
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Are you sure you want to cancel Order #${order.id}?`
                    );

                    if (!confirmed) {
                      return;
                    }

                    setCancellingOrderId(order.id);
                    cancelOrder.mutate(order.id, {
                      onSettled: () => setCancellingOrderId(null),
                    });
                  }}
                  className="ml-2 mt-3 inline-block rounded bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}