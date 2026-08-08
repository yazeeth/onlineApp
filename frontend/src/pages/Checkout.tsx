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
    return <div className="p-6">Loading checkout...</div>;
  }

  if (isAddressesError) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
        <p className="text-red-600">Failed to load your addresses.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="space-y-6 rounded border p-6">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

          <div className="space-y-3">
            {cart?.items?.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span>
                  ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 text-lg font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <button
              type="button"
              onClick={() => setShowAddressForm((current) => !current)}
              className="rounded border px-3 py-2 text-sm"
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>
          </div>

          {hasAddresses && !showAddressForm && (
            <div className="space-y-3">
              {addresses.map((item) => (
                <label
                  key={item.id}
                  className={`block cursor-pointer rounded border p-4 ${
                    selectedAddressId === item.id
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={item.id}
                      checked={selectedAddressId === item.id}
                      onChange={() => setSelectedAddressId(item.id)}
                    />
                    <div>
                      <p className="font-semibold">{item.fullName}</p>
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

          {showAddressForm && (
            <div className="space-y-3 rounded border p-4">
              <input
                value={newAddress.fullName}
                onChange={(e) => handleAddressChange("fullName", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Full name"
                required
              />
              <input
                value={newAddress.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Phone"
                required
              />
              <input
                value={newAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Street address"
                required
              />
              <input
                value={newAddress.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="City"
                required
              />
              <input
                value={newAddress.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Country"
                required
              />
              <input
                value={newAddress.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Postal code"
                required
              />

              <button
                type="button"
                onClick={handleCreateAddress}
                disabled={createAddress.isPending}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                {createAddress.isPending ? "Saving address..." : "Save Address"}
              </button>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="BANK_TRANSFER"
                checked={paymentMethod === "BANK_TRANSFER"}
                onChange={() => setPaymentMethod("BANK_TRANSFER")}
              />
              <span>Bank Transfer</span>
            </label>
          </div>
        </section>

        {createOrder.isError && (
          <p className="text-red-600">Failed to place the order. Please try again.</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={createOrder.isPending || !selectedAddressId}
          className="w-full rounded bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createOrder.isPending ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}