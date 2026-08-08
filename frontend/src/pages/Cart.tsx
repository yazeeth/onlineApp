import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../types/cart.types";

export default function Cart() {
  const { cart, isLoading, error, updateItem, removeItem } = useCart();

  const items: CartItem[] = Array.isArray(cart?.items) ? cart.items : [];

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.product?.price ?? 0);
    return total + price * item.quantity;
  }, 0);

  const handleQuantityChange = (item: CartItem, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    updateItem.mutate({
      id: item.id,
      data: {
        quantity: Math.floor(quantity),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-700">Failed to load cart</h1>
        <p className="mt-2 text-sm text-red-600">Please try again later.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-10 text-center shadow-sm sm:p-14">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-5 text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-500">
          Discover products and add your favourites to your shopping cart.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-block rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Your Shopping Cart
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Cart</h1>
        <p className="mt-2 text-gray-600">
          Review your items before continuing to checkout.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <section className="space-y-4">
          {items.map((item) => {
            const product = item.product;
            const price = Number(product?.price ?? 0);
            const itemTotal = price * item.quantity;

            return (
              <article
                key={item.id}
                className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {product?.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name ?? "Product"}
                      className="h-28 w-full rounded-xl object-cover sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500 sm:w-28">
                      No image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold">
                      {product?.name ?? "Product"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      ${price.toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <div className="flex items-center rounded-xl border">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItem.isPending}
                        className="h-10 w-10 font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={updateItem.isPending}
                        className="h-10 w-10 font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-24 text-right font-bold">
                      ${itemTotal.toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={removeItem.isPending}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removeItem.isPending ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Items</span>
              <span className="font-semibold">{items.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-bold">Subtotal</span>
              <span className="text-2xl font-bold">${subtotal.toLocaleString()}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-xl bg-gray-950 px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-gray-700"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="mt-3 block rounded-xl border px-5 py-3.5 text-center text-sm font-semibold hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}