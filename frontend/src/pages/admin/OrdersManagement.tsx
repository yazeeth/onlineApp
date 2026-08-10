import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import { paymentApi } from "../../api/paymentApi";
import type { Order } from "../../types/order.types";

export default function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.getAllOrdersAdmin();
        if (mounted) {
          setOrders(response ?? []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load orders");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const orderStatuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const;

  const paymentStatuses = [
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
  ] as const;

  const statuses = useMemo(() => {
    const values = orders
      .map((order) => String(order.status ?? "").trim())
      .filter(Boolean);
    return Array.from(new Set(values));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customer = order.user;
      const matchesStatus =
        status === "all" || String(order.status ?? "") === status;
      const matchesSearch =
        !query ||
        String(order.id ?? "").toLowerCase().includes(query) ||
        String(order.userId ?? "").toLowerCase().includes(query) ||
        String(order.status ?? "").toLowerCase().includes(query) ||
        String(customer?.name ?? "").toLowerCase().includes(query) ||
        String(customer?.email ?? "").toLowerCase().includes(query) ||
        String(customer?.phone ?? "").toLowerCase().includes(query) ||
        order.items.some((item) =>
          String(item.productName ?? "").toLowerCase().includes(query),
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  const formatMoney = (value: number | string | null | undefined) => {
    if (value == null) return "—";
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  };

  const getStatusClasses = (value: string | undefined) => {
    switch (String(value ?? "").toUpperCase()) {
      case "COMPLETED":
      case "DELIVERED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-50 text-red-700";
      case "PROCESSING":
      case "SHIPPED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const updateStatuses = async (
    order: Order,
    nextOrderStatus: Order["status"],
    nextPaymentStatus: NonNullable<NonNullable<Order["payment"]>["status"]>,
  ) => {
    if (!order.payment?.id) {
      setStatusError(`Order #${order.id} does not have a payment record.`);
      return;
    }

    setSavingOrderId(order.id);
    setStatusError(null);

    try {
      if (nextOrderStatus !== order.status) {
        await orderApi.updateStatus(order.id, {
          status: nextOrderStatus,
        });
      }

      if (nextPaymentStatus !== order.payment.status) {
        await paymentApi.updateStatus(order.payment.id, {
          status: nextPaymentStatus,
        });
      }

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? {
                ...currentOrder,
                status: nextOrderStatus,
                payment: currentOrder.payment
                  ? {
                      ...currentOrder.payment,
                      status: nextPaymentStatus,
                    }
                  : currentOrder.payment,
              }
            : currentOrder,
        ),
      );
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : `Failed to update order #${order.id}.`,
      );
    } finally {
      setSavingOrderId(null);
    }
  };

  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </button>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Orders Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              View customer details, payments, order items, and historical order information.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders, customers, products..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:w-80"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="all">All statuses</option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Orders</p>
            <p className="mt-1 text-lg font-black text-gray-900">
              {filteredOrders.length} of {orders.length}
            </p>
          </div>
          <p className="text-sm text-gray-500">Select an order to view full details.</p>
        </div>

        {statusError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {statusError}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-base font-bold text-gray-900">No orders found.</p>
              <p className="mt-1 text-sm text-gray-500">
                Try changing the search text or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Ordered</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOrders.map((order) => {
                    const customer = order.user;
                    const payment = order.payment;
                    const expanded = expandedOrderId === order.id;

                    return (
                      <>
                        <tr key={order.id} className="align-top hover:bg-gray-50">
                          <td className="px-6 py-5">
                            <p className="font-black text-gray-900">#{order.id}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-bold text-gray-900">{customer?.name ?? "Unknown customer"}</p>
                            <p className="mt-1 text-sm text-gray-600">{customer?.phone ?? "No phone number"}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{customer?.email ?? "No email"}</p>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-700">
                            <p className="font-bold">{payment?.method ?? "—"}</p>
                            {payment?.status && (
                              <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(payment.status)}`}>
                                {payment.status}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClasses(order.status)}`}>
                              {order.status ?? "—"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm font-black text-gray-900">
                            {formatMoney(order.totalAmount)}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
                            >
                              {expanded ? "Hide details" : "View details"}
                            </button>
                          </td>
                        </tr>

                        {expanded && (
                          <tr key={`${order.id}-details`} className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-6">
                              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                                <div>
                                  <div className="mb-4 flex items-center justify-between">
                                    <div>
                                      <h2 className="text-base font-black text-gray-900">Order items</h2>
                                      <p className="mt-1 text-xs text-gray-500">
                                        Historical product information captured when the order was placed.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    {order.items.length === 0 ? (
                                      <p className="p-5 text-sm text-gray-500">No items recorded.</p>
                                    ) : (
                                      <div className="divide-y divide-gray-100">
                                        {order.items.map((item) => (
                                          <div key={item.id} className="flex gap-4 p-4">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                              {item.productImage ? (
                                                <img
                                                  src={item.productImage}
                                                  alt={item.productName}
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="flex h-full items-center justify-center text-[10px] font-bold text-gray-400">
                                                  No image
                                                </div>
                                              )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                              <p className="font-bold text-gray-900">{item.productName}</p>
                                              <p className="mt-1 text-sm text-gray-500">
                                                {item.quantity} × {formatMoney(item.price)}
                                              </p>
                                            </div>

                                            <p className="whitespace-nowrap text-sm font-black text-gray-900">
                                              {formatMoney(Number(item.price) * item.quantity)}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    <h2 className="text-sm font-black text-gray-900">Update status</h2>
                                    <div className="mt-4 space-y-4">
                                      <div>
                                        <label
                                          htmlFor={`order-status-${order.id}`}
                                          className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                                        >
                                          Order status
                                        </label>
                                        <select
                                          id={`order-status-${order.id}`}
                                          defaultValue={order.status}
                                          disabled={savingOrderId === order.id}
                                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {orderStatuses.map((value) => (
                                            <option key={value} value={value}>
                                              {value}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor={`payment-status-${order.id}`}
                                          className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
                                        >
                                          Payment status
                                        </label>
                                        <select
                                          id={`payment-status-${order.id}`}
                                          defaultValue={payment?.status ?? "PENDING"}
                                          disabled={savingOrderId === order.id}
                                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {paymentStatuses.map((value) => (
                                            <option key={value} value={value}>
                                              {value}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <button
                                        type="button"
                                        disabled={savingOrderId === order.id || !payment?.id}
                                        onClick={(event) => {
                                          const container = event.currentTarget.parentElement;
                                          const orderSelect = container?.querySelector(
                                            `#order-status-${order.id}`,
                                          ) as HTMLSelectElement | null;
                                          const paymentSelect = container?.querySelector(
                                            `#payment-status-${order.id}`,
                                          ) as HTMLSelectElement | null;

                                          void updateStatuses(
                                            order,
                                            (orderSelect?.value ?? order.status) as Order["status"],
                                            (paymentSelect?.value ?? payment?.status ?? "PENDING") as NonNullable<NonNullable<Order["payment"]>["status"]>,
                                          );
                                        }}
                                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {savingOrderId === order.id ? "Saving..." : "Save status changes"}
                                      </button>

                                      {!payment?.id && (
                                        <p className="text-xs font-medium text-amber-600">
                                          Payment status cannot be changed because this order has no payment record.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    <h2 className="text-sm font-black text-gray-900">Customer</h2>
                                    <dl className="mt-3 space-y-2 text-sm">
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Name</dt>
                                        <dd className="text-right font-bold text-gray-900">{customer?.name ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Phone</dt>
                                        <dd className="text-right font-bold text-gray-900">{customer?.phone ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Email</dt>
                                        <dd className="break-all text-right font-bold text-gray-900">{customer?.email ?? "—"}</dd>
                                      </div>
                                    </dl>
                                  </div>

                                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    <h2 className="text-sm font-black text-gray-900">Payment</h2>
                                    <dl className="mt-3 space-y-2 text-sm">
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Method</dt>
                                        <dd className="font-bold text-gray-900">{payment?.method ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Status</dt>
                                        <dd className="font-bold text-gray-900">{payment?.status ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                                        <dt className="font-bold text-gray-700">Total</dt>
                                        <dd className="font-black text-gray-900">{formatMoney(order.totalAmount)}</dd>
                                      </div>
                                    </dl>
                                  </div>

                                  {order.address && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                                      <h2 className="text-sm font-black text-gray-900">Delivery address</h2>
                                      <p className="mt-3 text-sm leading-6 text-gray-600">
                                        {Object.values(order.address)
                                          .filter((value) => value != null && String(value).trim() !== "")
                                          .map(String)
                                          .join(", ")}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}