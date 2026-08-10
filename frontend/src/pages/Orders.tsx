import { Link } from "react-router-dom";
import { useState } from "react";
import { useOrders } from "../hooks/useOrders";

const formatPrice = (value: number) =>
  `$${Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | Date | undefined) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
      return "bg-indigo-100 text-indigo-700";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const getPaymentStatusClasses = (status?: string) => {
  switch (status) {
    case "PAID":
      return "text-green-600";
    case "FAILED":
      return "text-red-600";
    case "REFUNDED":
      return "text-purple-600";
    default:
      return "text-amber-600";
  }
};

const getPaymentMethodLabel = (method?: string) => {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "COD":
      return "Cash on Delivery";
    default:
      return "Not available";
  }
};

export default function Orders() {
  const { orders, isLoading, error, cancelOrder } = useOrders();
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "delivered" | "all">("recent");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-10 w-48 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-7 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
              <div className="mt-6 h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="mt-5 h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-500">My Orders</p>
        <h1 className="mt-1 text-xl font-bold text-red-800">Failed to load orders</h1>
        <p className="mt-2 text-sm text-red-700">
          We couldn't retrieve your orders. Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-10 text-center shadow-sm sm:p-14">
        <div className="text-6xl">📦</div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-gray-400">
          My Orders
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          No orders yet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">
          Your completed purchases will appear here. Start shopping to place your first order.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-block rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  const deliveredOrders = sortedOrders.filter(
    (order) => String(order.status ?? "").toUpperCase() === "DELIVERED"
  );

  const visibleOrders =
    activeTab === "recent"
      ? sortedOrders.slice(0, 5)
      : activeTab === "delivered"
        ? deliveredOrders
        : sortedOrders;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
            Account
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">My Orders</h1>
          <p className="mt-2 text-gray-600">
            Track your purchases, payment status, and order details.
          </p>
        </div>
        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
          {orders.length} total order{orders.length === 1 ? "" : "s"}
        </div>
      </header>

      <div className="rounded-2xl border bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-1" role="tablist" aria-label="Order history filters">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "recent"}
            onClick={() => setActiveTab("recent")}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === "recent"
                ? "bg-gray-950 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Recent ({Math.min(sortedOrders.length, 5)})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "delivered"}
            onClick={() => setActiveTab("delivered")}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === "delivered"
                ? "bg-gray-950 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Delivered ({deliveredOrders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === "all"
                ? "bg-gray-950 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All ({sortedOrders.length})
          </button>
        </div>
      </div>

      {activeTab === "recent" && sortedOrders.length > 5 && (
        <p className="text-sm text-gray-500">
          Showing your 5 most recent orders. Select <span className="font-semibold">All</span> to view your complete order history.
        </p>
      )}

      <div className="space-y-4">
        {visibleOrders.map((order) => {
          const status = String(order.status ?? "PENDING").toUpperCase();
          const paymentStatus = String(order.payment?.status ?? "PENDING").toUpperCase();
          const isPending = status === "PENDING";
          const isCancelling = cancellingOrderId === order.id;

          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-950">Order #{order.id}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(status)}`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Ordered {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Order Total
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-950">
                      {formatPrice(Number(order.totalAmount))}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Payment Method
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {getPaymentMethodLabel(order.payment?.method)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Payment Status
                    </p>
                    <p className={`mt-2 font-semibold ${getPaymentStatusClasses(paymentStatus)}`}>
                      {paymentStatus.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                  >
                    View Order Details
                  </Link>

                  {isPending && (
                    <button
                      type="button"
                      disabled={isCancelling || cancelOrder.isPending}
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Are you sure you want to cancel Order #${order.id}?`
                        );

                        if (!confirmed) return;

                        setCancellingOrderId(order.id);
                        cancelOrder.mutate(order.id, {
                          onSettled: () => setCancellingOrderId(null),
                        });
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {activeTab === "delivered" && deliveredOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <div className="text-4xl">📦</div>
            <h2 className="mt-3 text-lg font-bold text-gray-900">No delivered orders yet</h2>
            <p className="mt-1 text-sm text-gray-500">
              Completed deliveries will appear here as your order history grows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}