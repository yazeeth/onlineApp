import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useAuthStore } from "../store/authStore";

type ProductCategory = {
  id?: string | number;
  name?: string;
};

type DisplayProduct = {
  id: string | number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  image?: string | null;
  category?: ProductCategory | null;
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuthStore();
  const isAdmin = String(user?.role ?? "").toUpperCase() === "ADMIN";
  const { products, isLoading, error } = useProducts();
  const [quantity, setQuantity] = useState(1);

  const productList = (Array.isArray(products) ? products : []) as DisplayProduct[];
  const product = productList.find((item) => String(item.id) === String(id));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-[28rem] animate-pulse rounded-3xl border border-gray-200 bg-gray-100" />
          <div className="space-y-5">
            <div className="h-5 w-32 animate-pulse rounded border border-gray-200 bg-gray-100" />
            <div className="h-10 w-3/4 animate-pulse rounded border border-gray-200 bg-gray-100" />
            <div className="h-24 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-32 animate-pulse rounded border border-gray-200 bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="text-5xl">🛍️</div>
        <h1 className="mt-5 text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-500">
          The product may have been removed or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }

    const maxQuantity = Math.max(product.stock, 1);
    setQuantity(Math.min(Math.max(Math.floor(value), 1), maxQuantity));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please log in to add products to your cart.");
      navigate("/login");
      return;
    }

    addItem.mutate({
      productId: Number(product.id),
      quantity,
    });
  };

  const productImage = product.imageUrl ?? product.image ?? null;
  const productImageUrl = productImage
    ? /^https?:\/\//i.test(productImage)
      ? productImage
      : productImage.startsWith("/")
        ? productImage
        : `/${productImage}`
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-brand-700"
      >
        ← Back to Products
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-gray-50 to-brand-50/40 p-6 sm:p-10">
            {productImage ? (
              <img
                src={productImageUrl ?? undefined}
                alt={product.name}
                className="h-[28rem] w-full rounded-2xl bg-white object-contain p-4 shadow-sm transition duration-500 hover:scale-[1.01]"
              />
            ) : (
              <div className="flex h-[28rem] w-full items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500">
                No image available
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
              {product.category?.name ?? "Uncategorized"}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-black tracking-tight text-brand-700">
              ${product.price.toLocaleString()}
            </p>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-bold">
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {product.stock > 0
                  ? `${product.stock} available`
                  : "This product is currently unavailable."}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-600">
                Description
              </h2>
              <p className="mt-3 leading-7 text-gray-600">
                {product.description ?? "No description available."}
              </p>
            </div>

            {!isAdmin && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <label htmlFor="quantity" className="text-sm font-bold">
                  Quantity
                </label>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={product.stock <= 0 || quantity <= 1}
                    className="h-11 w-11 rounded-xl border border-gray-200 font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Math.max(product.stock, 1)}
                    value={quantity}
                    disabled={product.stock <= 0}
                    onChange={(event) =>
                      handleQuantityChange(Number(event.target.value))
                    }
                    className="h-11 w-20 rounded-xl border border-gray-200 text-center outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                    className="h-11 w-11 rounded-xl border border-gray-200 font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addItem.isPending}
                  className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {product.stock <= 0
                    ? "Out of Stock"
                    : addItem.isPending
                      ? "Adding to Cart..."
                      : "Add to Cart"}
                </button>

                {user ? (
                  <Link
                    to="/cart"
                    className="mt-3 block w-full rounded-xl border border-gray-200 px-5 py-3.5 text-center text-sm font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    View Cart
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Please log in to view your cart.");
                      navigate("/login");
                    }}
                    className="mt-3 block w-full rounded-xl border border-gray-200 px-5 py-3.5 text-center text-sm font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    View Cart
                  </button>
                )}
              </div>
            )}
            {isAdmin && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-blue-900">
                    Admin view
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    You can browse product information here. Customer purchasing
                    and cart actions are disabled for admin accounts.
                  </p>
                  <Link
                    to="/admin"
                    className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                  >
                    Open Admin Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}