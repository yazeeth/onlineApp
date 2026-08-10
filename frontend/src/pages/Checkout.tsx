import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import {
  useAddresses,
  useCreateAddress,
} from "../hooks/useAddresses";
import type { CreateAddressInput } from "../api/addressApi";

const emptyAddress: CreateAddressInput = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  country: "",
  postalCode: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, isLoading: isCartLoading } = useCart();
  const { createOrder } = useOrders();
  const { data: addresses = [], isLoading: isAddressesLoading, isError: isAddressesError } = useAddresses();
  const hasAddresses = addresses.length > 0;
  const createAddress = useCreateAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<CreateAddressInput>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">(
    "COD",
  );

  const total =
    cart?.items?.reduce(
      (sum, item) =>
        sum + (item.product?.price ?? 0) * item.quantity,
      0,
    ) ?? 0;

  const handleAddressChange = (
    field: keyof CreateAddressInput,
    value: string,
  ) => {
    setNewAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateAddress = () => {
    createAddress.mutate(newAddress, {
      onSuccess: (address) => {
        setSelectedAddressId(address.id);
        setShowAddressForm(false);
        setNewAddress(emptyAddress);
      },
    });
  };

  const handleSubmit = () => {
    if (!selectedAddressId) {
      return;
    }

    createOrder.mutate(
      {
        addressId: selectedAddressId,
        paymentMethod,
      },
      {
        onSuccess: () => {
          navigate("/orders");
        },
      },
    );
  };

  const isLoading = isCartLoading || isAddressesLoading;

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 text-gray-700">Loading checkout...</div>;
  }

  if (isAddressesError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-950">Checkout</h1>
        <p className="text-danger-500">Failed to load your addresses.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Checkout</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
          Complete your order
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Review your items, choose a delivery address, and select a payment method.
        </p>
      </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Step 1</p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-950">Shipping Address</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm((current) => !current)}
                  disabled={createOrder.isPending}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>
              </div>

              {hasAddresses && !showAddressForm && (
                <div className="space-y-3">
                  {addresses.map((item) => (
                    <label
                      key={item.id}
                      className={`block cursor-pointer rounded-xl border p-4 transition ${
                        selectedAddressId === item.id
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                          : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/40"
                      }`}
                    >
                      <div className="flex gap-3">
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={item.id}
                          checked={selectedAddressId === item.id}
                          onChange={() => setSelectedAddressId(item.id)}
                          disabled={createOrder.isPending}
                          className="mt-1"
                        />
                        <div className="min-w-0 text-sm leading-6 text-gray-600">
                          <p className="font-bold text-gray-950">{item.fullName}</p>
                          <p>{item.phone}</p>
                          <p>{item.street}</p>
                          <p>
                            {item.city}, {item.postalCode}
                          </p>
                          <p>{item.country}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!hasAddresses && !showAddressForm && (
                <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-5 text-center">
                  <p className="font-bold text-gray-950">No shipping address yet</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Add an address before placing your order.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    disabled={createOrder.isPending}
                    className="mt-4 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
                  >
                    Add Shipping Address
                  </button>
                </div>
              )}

              {showAddressForm && (
                <div className="space-y-3 rounded-xl border border-brand-100 bg-brand-50/30 p-4 shadow-sm sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={newAddress.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Full name"
                      required
                    />
                    <input
                      value={newAddress.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Phone"
                      required
                    />
                  </div>
                  <input
                    value={newAddress.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Street address"
                    required
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      value={newAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="City"
                      required
                    />
                    <input
                      value={newAddress.country}
                      onChange={(e) => handleAddressChange("country", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Country"
                      required
                    />
                    <input
                      value={newAddress.postalCode}
                      onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Postal code"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateAddress}
                    disabled={createAddress.isPending || createOrder.isPending}
                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createAddress.isPending ? "Saving address..." : "Save Address"}
                  </button>
                </div>
              )}

              {!selectedAddressId && hasAddresses && !showAddressForm && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-warning-500">
                  Please select a shipping address to continue.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-6">
              <div className="mb-5">
                <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Step 2</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-950">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`block cursor-pointer rounded-xl border p-4 transition ${
                    paymentMethod === "COD"
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                      : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/40"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      disabled={createOrder.isPending}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-gray-950">Cash on Delivery</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Pay for your order when it arrives at your delivery address.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`block cursor-pointer rounded-xl border p-4 transition ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                      : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/40"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      disabled={createOrder.isPending}
                      className="mt-1"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-950">Bank Transfer</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Transfer the order amount to our bank account after placing the order.
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === "BANK_TRANSFER" && (
                <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-950">Bank transfer instructions</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your order will remain pending until the transfer is verified.
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                    <div>
                      <span className="text-gray-500">Bank:</span> Your Bank
                    </div>
                    <div>
                      <span className="text-gray-500">Account Name:</span> OnlineShop
                    </div>
                    <div>
                      <span className="text-gray-500">Account Number:</span> XXXXXXXX
                    </div>
                    <div>
                      <span className="text-gray-500">Branch:</span> Main Branch
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Replace these placeholder details with your real business bank details before production.
                  </p>
                </div>
              )}
            </section>

            {createOrder.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-danger-500 shadow-sm">
                Failed to place the order. Please check your address and try again.
              </div>
            )}

            {createAddress.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-danger-500 shadow-sm">
                Failed to save the address. Please check the details and try again.
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6 lg:sticky lg:top-6">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Order Summary</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-950">Your order</h2>

            <div className="mt-5 space-y-4">
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-950">
                      {item.product?.name}
                    </p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="shrink-0 font-bold text-brand-700">
                    ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex items-center justify-between text-lg font-bold text-gray-950">
              <span>Total</span>
              <span className="text-brand-700">${total.toFixed(2)}</span>
            </div>

            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-5 text-gray-500">
              By placing this order, you confirm that your shipping address and payment method are correct.
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={createOrder.isPending || !selectedAddressId}
              className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createOrder.isPending ? "Placing order..." : `Place Order · $${total.toFixed(2)}`}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}