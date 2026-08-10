import { useEffect, useMemo, useState } from "react";
import { paymentApi } from "../../api/paymentApi";
import type { Payment } from "../../types/payment.types";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let mounted = true;

    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await paymentApi.getAllPayments();
        if (mounted) {
          setPayments(response ?? []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load payments");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadPayments();

    return () => {
      mounted = false;
    };
  }, []);

  const statuses = useMemo(() => {
    const values = payments
      .map((payment) => String(payment.status ?? "").trim())
      .filter(Boolean);
    return Array.from(new Set(values));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        status === "all" || String(payment.status ?? "") === status;
      const matchesSearch =
        !query ||
        String(payment.id ?? "").toLowerCase().includes(query) ||
        String(payment.orderId ?? "").toLowerCase().includes(query) ||
        String(payment.status ?? "").toLowerCase().includes(query) ||
        String(payment.method ?? "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [payments, search, status]);

  const renderStatusBadge = (statusValue: string | undefined) => {
    const statusLower = (statusValue ?? "").toLowerCase();
    const successStatuses = ["paid", "completed", "success", "succeeded"];
    const isSuccess = successStatuses.includes(statusLower);
    const baseClasses =
      "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5";
    if (isSuccess) {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {statusValue}
        </span>
      );
    }
    if (!statusValue) {
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-600`}>
          Unknown
        </span>
      );
    }
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-600`}>
        {statusValue}
      </span>
    );
  };

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-950">Payments Management</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Monitor customer payments, transactions, methods, and payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-fit items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-gray-400">
            {search.trim() || status !== "all"
              ? `${filteredPayments.length} matching payments`
              : `${payments.length} payments`}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payments, orders..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 sm:w-72"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 sm:w-44"
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Payments</p>
          <p className="mt-1 text-2xl font-black text-gray-950">{payments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Successful</p>
          <p className="mt-1 text-2xl font-black text-gray-950">
            {payments.filter((payment) => String(payment.status ?? "").toLowerCase() === "paid" || String(payment.status ?? "").toLowerCase() === "completed" || String(payment.status ?? "").toLowerCase() === "success" || String(payment.status ?? "").toLowerCase() === "succeeded").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Amount</p>
          <p className="mt-1 text-2xl font-black text-gray-950">
            {payments.reduce((total, payment) => total + (payment.amount != null ? Number(payment.amount) || 0 : 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-gray-600">Loading payments...</p>
            <p className="mt-1 text-xs text-gray-400">Fetching the latest payment transactions.</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-gray-700">No payments found.</p>
            <p className="mt-1 text-xs text-gray-400">
              Try changing the search text or payment status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Order</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Method</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-900">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">Customer</p>
                        <p className="mt-0.5 text-xs text-gray-400">Details unavailable</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      {payment.orderId ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      {payment.amount != null ? Number(payment.amount).toFixed(2) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      {payment.method ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm">
                      {renderStatusBadge(payment.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}