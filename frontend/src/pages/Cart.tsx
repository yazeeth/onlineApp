import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../types/cart.types";

const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Cart() {
  const { cart, isLoading, error, updateItem, removeItem } = useCart();

  const items: CartItem[] = Array.isArray(cart?.items) ? cart.items : [];

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.product?.price ?? 0);
    return total + price * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const getProductImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return normalizedPath;
  };

  const invalidStockItems = items.filter((item) => {
    const stock = Number((item.product as { stock?: number | string } | null | undefined)?.stock ?? 0);
    return stock <= 0 || item.quantity > stock;
  });

  const handleQuantityChange = (item: CartItem, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    const stock = Number((item.product as { stock?: number | string } | null | undefined)?.stock ?? 0);
    if (stock > 0 && quantity > stock) {
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
        <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-red-600">Shopping Cart</p>
        <h1 className="mt-1 text-xl font-semibold text-red-700">Failed to load cart</h1>
        <p className="mt-2 text-sm text-red-600">Please refresh the page and try again.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm sm:p-14">
        <div className="text-6xl">🛒</div>
        <p className="mt-5 text-sm font-bold uppercase tracking-wider text-brand-600">
          Shopping Cart
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-gray-500">
          Discover products and add your favourites to your shopping cart.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
            Your Shopping Cart
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950">Cart</h1>
          <p className="mt-2 text-gray-600">
            Review your items before continuing to checkout.
          </p>
        </div>
        <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 ring-1 ring-brand-100">
          {totalQuantity} item{totalQuantity === 1 ? "" : "s"}
        </div>
      </div>

      {invalidStockItems.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
          <p className="font-semibold text-amber-900">Cart needs attention</p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            One or more products are unavailable or have insufficient stock. Adjust the quantities before checkout.
          </p>
        </div>
      )}

      {(updateItem.isError || removeItem.isError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm sm:p-5">
          <p className="font-semibold text-red-800">Cart update failed</p>
          <p className="mt-1 text-sm text-red-700">
            We couldn't update your cart. Please try again.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <section className="space-y-4">
          {items.map((item) => {
            const product = item.product;
            const productImageUrl = getProductImageUrl(product?.image ?? null);
            const price = Number(product?.price ?? 0);
            const stock = Number((product as { stock?: number | string } | null | undefined)?.stock ?? 0);
            const itemTotal = price * item.quantity;
            const isOutOfStock = stock <= 0;
            const isOverStock = stock > 0 && item.quantity > stock;
            const isLowStock = stock > 0 && stock <= 5;
            const quantityLimit = stock > 0 ? stock : 1;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                  <Link to={`/products/${product?.id}`} className="shrink-0">
                    {productImageUrl ? (
                      <img
                        src={productImageUrl}
                        alt={product?.name ?? "Product"}
                        className="h-32 w-full rounded-xl border border-gray-100 bg-gray-50 object-contain p-1 transition duration-300 hover:border-brand-200 hover:opacity-90 sm:h-28 sm:w-28"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 sm:h-28 sm:w-28">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${product?.id}`}
                      className="text-lg font-bold tracking-tight text-gray-950 transition hover:text-brand-700 hover:underline"
                    >
                      {product?.name ?? "Product"}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{formatPrice(price)} each</p>

                    {isOutOfStock ? (
                      <p className="mt-2 text-xs font-bold text-danger-500">Out of stock</p>
                    ) : isOverStock ? (
                      <p className="mt-2 text-xs font-bold text-warning-500">
                        Only {stock} available — reduce quantity
                      </p>
                    ) : isLowStock ? (
                      <p className="mt-2 text-xs font-bold text-warning-500">Only {stock} left</p>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-success-500">In stock</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 sm:border-t-0 sm:pt-0 sm:justify-end">
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItem.isPending || removeItem.isPending}
                        aria-label={`Decrease quantity of ${product?.name ?? "product"}`}
                        className="h-10 w-10 font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={
                          isOutOfStock ||
                          item.quantity >= quantityLimit ||
                          updateItem.isPending ||
                          removeItem.isPending
                        }
                        aria-label={`Increase quantity of ${product?.name ?? "product"}`}
                        className="h-10 w-10 font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-24 text-right text-lg font-black tracking-tight text-brand-700">
                      {formatPrice(itemTotal)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={removeItem.isPending || updateItem.isPending}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removeItem.isPending ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Order Summary</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">Your order</h2>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Products</span>
              <span className="font-semibold text-gray-900">{items.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Total quantity</span>
              <span className="font-semibold text-gray-900">{totalQuantity}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Shipping</span>
              <span className="text-right font-semibold text-gray-900">Calculated at checkout</span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-bold text-gray-900">Subtotal</span>
              <span className="text-2xl font-black tracking-tight text-brand-700">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            aria-disabled={invalidStockItems.length > 0}
            onClick={(event) => {
              if (invalidStockItems.length > 0) {
                event.preventDefault();
              }
            }}
            className={`mt-6 block rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition ${
              invalidStockItems.length > 0
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
            }`}
          >
            Fix Cart to Continue
          </Link>

          <Link
            to="/products"
            className="mt-3 block rounded-xl border border-gray-200 px-5 py-3.5 text-center text-sm font-semibold text-gray-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            Continue Shopping
          </Link>

          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-5 text-gray-500">
            Final stock availability is verified by the server when your cart and order are processed.
          </div>
        </aside>
      </div>
    </div>
  );
}