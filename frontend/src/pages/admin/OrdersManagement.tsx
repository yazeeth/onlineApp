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

  // Packing slip/invoice print helper
  const printPackingSlip = (order: Order) => {
    const printWindow = window.open("", "_blank", "width=600,height=800");

    if (!printWindow) {
      return;
    }

    const customer = order.user;
    const payment = order.payment;
    const address = order.address;
    const items = order.items ?? [];

    const addressText = address
      ? Object.values(address)
          .filter((value) => value != null && String(value).trim() !== "")
          .map(String)
          .join(", ")
      : "Not available";

    const itemRows = items
      .map(
        (item) => `
          <tr>
            <td class="product">${String(item.productName ?? "Product")}</td>
            <td class="qty">${item.quantity}</td>
            <td class="price">${formatMoney(item.price)}</td>
            <td class="total">${formatMoney(Number(item.price) * item.quantity)}</td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.id} - Packing Slip</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * { box-sizing: border-box; }
            @page { size: 100mm auto; margin: 5mm; }
            body {
              margin: 0;
              background: #fff;
              color: #111827;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11px;
              line-height: 1.35;
            }
            .slip {
              width: 100%;
              max-width: 90mm;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #111827;
              padding-bottom: 7px;
              margin-bottom: 8px;
            }
            .brand {
              font-size: 18px;
              font-weight: 800;
            }
            .order-number {
              margin-top: 2px;
              font-size: 15px;
              font-weight: 800;
            }
            .meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px 8px;
              margin-bottom: 8px;
            }
            .label {
              color: #64748b;
              font-size: 9px;
              text-transform: uppercase;
              font-weight: 700;
            }
            .value { font-weight: 700; }
            .section {
              border-top: 1px solid #cbd5e1;
              padding-top: 7px;
              margin-top: 7px;
            }
            .section-title {
              margin-bottom: 5px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: .04em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }
            th, td {
              padding: 4px 2px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            th {
              color: #64748b;
              font-size: 8px;
              text-transform: uppercase;
            }
            .product { width: 45%; font-weight: 700; word-break: break-word; }
            .qty { width: 12%; text-align: center; }
            .price, .total { width: 21.5%; text-align: right; white-space: nowrap; }
            .address {
              padding: 6px 7px;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              font-weight: 600;
              word-break: break-word;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px;
            }
            .payment-box {
              padding: 5px 6px;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
            }
            .grand-total {
              display: flex;
              justify-content: space-between;
              padding-top: 7px;
              font-size: 14px;
              font-weight: 800;
            }
            .footer {
              margin-top: 9px;
              padding-top: 6px;
              border-top: 1px dashed #94a3b8;
              text-align: center;
              color: #64748b;
              font-size: 8px;
            }
          </style>
        </head>
        <body>
          <main class="slip">
            <div class="header">
              <div class="brand">ONLINE SHOP</div>
              <div class="order-number">ORDER #${order.id}</div>
            </div>

            <div class="meta">
              <div><div class="label">Customer</div><div class="value">${String(customer?.name ?? "—")}</div></div>
              <div><div class="label">Date</div><div class="value">${String(formatDate(order.createdAt))}</div></div>
              <div><div class="label">Phone</div><div class="value">${String(customer?.phone ?? "—")}</div></div>
              <div><div class="label">Email</div><div class="value">${String(customer?.email ?? "—")}</div></div>
            </div>

            <section class="section">
              <div class="section-title">Products</div>
              <table>
                <thead>
                  <tr>
                    <th class="product">Product</th>
                    <th class="qty">Qty</th>
                    <th class="price">Price</th>
                    <th class="total">Total</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
              <div class="grand-total"><span>ORDER TOTAL</span><span>${formatMoney(order.totalAmount)}</span></div>
            </section>

            <section class="section">
              <div class="section-title">Delivery Address</div>
              <div class="address">${addressText}</div>
            </section>

            <section class="section">
              <div class="section-title">Payment</div>
              <div class="payment-grid">
                <div class="payment-box"><div class="label">Method</div><div class="value">${String(payment?.method ?? "—")}</div></div>
                <div class="payment-box"><div class="label">Status</div><div class="value">${String(payment?.status ?? "—")}</div></div>
              </div>
            </section>

            <div class="footer">Packing slip / order invoice • Order #${order.id}</div>
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const getStatusClasses = (value: string | undefined) => {
    switch (String(value ?? "").toUpperCase()) {
      case "COMPLETED":
      case "DELIVERED":
      case "PAID":
        return "border border-emerald-800 bg-emerald-950/60 text-emerald-200";
      case "CANCELLED":
      case "FAILED":
        return "border border-red-800 bg-red-950/60 text-red-200";
      case "PROCESSING":
      case "SHIPPED":
        return "border border-blue-800 bg-blue-950/60 text-blue-200";
      default:
        return "border border-amber-800 bg-amber-950/60 text-amber-200";
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
    <section className="min-h-screen bg-[var(--background)] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--text-accent)] shadow-sm hover:bg-[var(--surface-secondary)]"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </button>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Orders Management</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              View customer details, payments, order items, and historical order information.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders, customers, products..."
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 sm:w-80"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
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
          <div className="mb-5 rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm font-medium text-red-200">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Orders</p>
            <p className="mt-1 text-lg font-black text-[var(--text-primary)]">
              {filteredOrders.length} of {orders.length}
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Select an order to view full details.</p>
        </div>

        {statusError && (
          <div className="mb-5 rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm font-medium text-red-200">
            {statusError}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-[var(--text-muted)]">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-base font-bold text-[var(--text-primary)]">No orders found.</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Try changing the search text or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] divide-y divide-[var(--border-strong)]">
                <thead className="bg-[var(--surface-secondary)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Ordered</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                  {filteredOrders.map((order) => {
                    const customer = order.user;
                    const payment = order.payment;
                    const expanded = expandedOrderId === order.id;

                    return (
                      <>
                        <tr key={order.id} className="align-top hover:bg-[var(--surface-secondary)]">
                          <td className="px-6 py-5">
                            <p className="font-black text-[var(--text-primary)]">#{order.id}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-bold text-[var(--text-primary)]">{customer?.name ?? "Unknown customer"}</p>
                            <p className="mt-1 text-sm text-[var(--text-secondary)]">{customer?.phone ?? "No phone number"}</p>
                            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{customer?.email ?? "No email"}</p>
                          </td>

                          <td className="px-6 py-5 text-sm text-[var(--text-secondary)]">
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

                          <td className="whitespace-nowrap px-6 py-5 text-sm font-black text-[var(--text-primary)]">
                            {formatMoney(order.totalAmount)}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-[var(--text-secondary)]">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                              className="rounded-lg border border-[var(--border-strong)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
                            >
                              {expanded ? "Hide details" : "View details"}
                            </button>
                          </td>
                        </tr>

                        {expanded && (
                          <tr key={`${order.id}-details`} className="bg-[var(--surface-secondary)]">
                            <td colSpan={7} className="px-6 py-6">
                              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                                <div>
                                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h2 className="text-base font-black text-[var(--text-primary)]">Order items</h2>
                                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                                        Historical product information captured when the order was placed.
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => printPackingSlip(order)}
                                      className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--brand-primary-dark)]"
                                    >
                                      🖨 Print Packing Slip
                                    </button>
                                  </div>

                                  <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)]">
                                    {order.items.length === 0 ? (
                                      <p className="p-5 text-sm text-[var(--text-muted)]">No items recorded.</p>
                                    ) : (
                                      <div className="divide-y divide-[var(--border)]">
                                        {order.items.map((item) => (
                                          <div key={item.id} className="flex gap-4 p-4">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)]">
                                              {item.productImage ? (
                                                <img
                                                  src={item.productImage}
                                                  alt={item.productName}
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="flex h-full items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">
                                                  No image
                                                </div>
                                              )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                              <p className="font-bold text-[var(--text-primary)]">{item.productName}</p>
                                              <p className="mt-1 text-sm text-[var(--text-muted)]">
                                                {item.quantity} × {formatMoney(item.price)}
                                              </p>
                                            </div>

                                            <p className="whitespace-nowrap text-sm font-black text-[var(--text-primary)]">
                                              {formatMoney(Number(item.price) * item.quantity)}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-5">
                                    <h2 className="text-sm font-black text-[var(--text-primary)]">Update status</h2>
                                    <div className="mt-4 space-y-4">
                                      <div>
                                        <label
                                          htmlFor={`order-status-${order.id}`}
                                          className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]"
                                        >
                                          Order status
                                        </label>
                                        <select
                                          id={`order-status-${order.id}`}
                                          defaultValue={order.status}
                                          disabled={savingOrderId === order.id}
                                          className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                                          className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]"
                                        >
                                          Payment status
                                        </label>
                                        <select
                                          id={`payment-status-${order.id}`}
                                          defaultValue={payment?.status ?? "PENDING"}
                                          disabled={savingOrderId === order.id}
                                          className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        className="w-full rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-bold text-slate-100 hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {savingOrderId === order.id ? "Saving..." : "Save status changes"}
                                      </button>

                                      {!payment?.id && (
                                        <p className="text-xs font-medium text-amber-300">
                                          Payment status cannot be changed because this order has no payment record.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-5">
                                    <h2 className="text-sm font-black text-[var(--text-primary)]">Customer</h2>
                                    <dl className="mt-3 space-y-2 text-sm">
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-[var(--text-muted)]">Name</dt>
                                        <dd className="text-right font-bold text-[var(--text-primary)]">{customer?.name ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-[var(--text-muted)]">Phone</dt>
                                        <dd className="text-right font-bold text-[var(--text-primary)]">{customer?.phone ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-[var(--text-muted)]">Email</dt>
                                        <dd className="break-all text-right font-bold text-[var(--text-primary)]">{customer?.email ?? "—"}</dd>
                                      </div>
                                    </dl>
                                  </div>

                                  <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-5">
                                    <h2 className="text-sm font-black text-[var(--text-primary)]">Payment</h2>
                                    <dl className="mt-3 space-y-2 text-sm">
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-[var(--text-muted)]">Method</dt>
                                        <dd className="font-bold text-[var(--text-primary)]">{payment?.method ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <dt className="text-[var(--text-muted)]">Status</dt>
                                        <dd className="font-bold text-[var(--text-primary)]">{payment?.status ?? "—"}</dd>
                                      </div>
                                      <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2">
                                        <dt className="font-bold text-[var(--text-secondary)]">Total</dt>
                                        <dd className="font-black text-[var(--text-primary)]">{formatMoney(order.totalAmount)}</dd>
                                      </div>
                                    </dl>
                                  </div>

                                  {order.address && (
                                    <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-5">
                                      <h2 className="text-sm font-black text-[var(--text-primary)]">Delivery address</h2>
                                      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
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