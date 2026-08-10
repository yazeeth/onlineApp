import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);

  const { order, isLoading, error, cancelOrder } = useOrders(
    id ? Number(id) : undefined,
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded border border-gray-200 bg-gray-100" />
          <div className="h-32 rounded-xl border border-gray-200 bg-gray-100" />
          <div className="h-48 rounded-xl border border-gray-200 bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h1 className="text-xl font-bold text-danger-500">Order not found</h1>
          <p className="mt-2 text-sm text-danger-500">
            We could not load this order. It may have been removed or you may not have access to it.
          </p>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
  ];

  const orderStatus = order.status;
  const statusIndex = statusSteps.indexOf(orderStatus);
  const isCancelled = orderStatus === "CANCELLED";
  const isPending = orderStatus === "PENDING";

  const handleCancel = () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.id}?`,
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    cancelOrder.mutate(order.id, {
      onSettled: () => setCancelling(false),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-brand-700"
        >
          ← Back to Orders
        </Link>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Order Details</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">Order #{order.id}</h1>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              isCancelled
                ? "bg-red-50 text-danger-500 ring-1 ring-red-200"
                : isPending
                  ? "bg-yellow-50 text-warning-500 ring-1 ring-yellow-200"
                  : orderStatus === "DELIVERED"
                    ? "bg-green-50 text-success-500 ring-1 ring-green-200"
                    : "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
            }`}
          >
            {orderStatus}
          </span>
        </div>

        {!isCancelled ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold tracking-tight text-gray-950">Order Status</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {statusSteps.map((status, index) => {
                const completed = statusIndex >= index;
                const current = statusIndex === index;

                return (
                  <div key={status} className="relative text-center">
                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        completed
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        current ? "text-brand-700" : "text-gray-500"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-danger-500">Order Cancelled</h2>
            <p className="mt-1 text-sm text-danger-500">
              This order has been cancelled and the reserved product stock has been released.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-gray-950">Products</h2>
              <span className="text-sm font-semibold text-brand-600">
                {order.items?.length ?? 0} item(s)
              </span>
            </div>

            <div className="mt-5 divide-y divide-gray-200">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name ?? "Product"}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold tracking-tight text-gray-950">
                      {item.product?.name ?? "Product"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    {item.product?.id && (
                      <Link
                        to={`/products/${item.product.id}`}
                        className="mt-2 inline-block text-sm font-semibold text-brand-600 underline underline-offset-4 transition hover:text-brand-700"
                      >
                        View Product
                      </Link>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Unit price</p>
                    <p className="font-bold text-gray-950">${item.price}</p>
                    <p className="mt-1 text-lg font-black tracking-tight text-brand-700">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold tracking-tight text-gray-950">Delivery Address</h2>
              <div className="mt-4 space-y-1 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                <p>{order.address?.street ?? "N/A"}</p>
                {order.address?.city && <p>{order.address.city}</p>}
                {order.address?.postalCode && <p>{order.address.postalCode}</p>}
                {order.address?.country && <p>{order.address.country}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-gray-950">Payment Details</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.payment?.status === "PAID"
                      ? "bg-green-50 text-success-500 ring-1 ring-green-200"
                      : order.payment?.status === "FAILED"
                        ? "bg-red-50 text-danger-500 ring-1 ring-red-200"
                        : order.payment?.status === "REFUNDED"
                          ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                          : "bg-yellow-50 text-warning-500 ring-1 ring-yellow-200"
                  }`}
                >
                  {order.payment?.status ?? "PENDING"}
                </span>
              </div>

              <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Payment method</span>
                  <span className="text-right font-bold text-gray-950">
                    {order.payment?.method === "BANK_TRANSFER"
                      ? "Bank Transfer"
                      : order.payment?.method === "COD"
                        ? "Cash on Delivery"
                        : "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-gray-950">
                    ${order.payment?.amount ?? order.totalAmount}
                  </span>
                </div>

                {order.payment?.createdAt && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Payment created</span>
                    <span className="text-right font-semibold text-gray-950">
                      {new Date(order.payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold tracking-tight text-gray-950">Order Summary</h2>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="font-bold text-gray-950">Total</span>
                <span className="text-2xl font-black tracking-tight text-brand-700">${order.totalAmount}</span>
              </div>
            </div>

            {isPending && (
              <button
                type="button"
                disabled={cancelling || cancelOrder.isPending}
                onClick={handleCancel}
                className="w-full rounded-xl bg-danger-500 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? "Cancelling Order..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}