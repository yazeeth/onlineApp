import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { user } = useAuth();
  const isAdmin = String(user?.role ?? "").toUpperCase() === "ADMIN";

  const categoryList = Array.isArray(categories) ? categories : [];
  const productList = Array.isArray(products) ? products : [];

  type HomeProduct = {
    id: string | number;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    imageUrl?: string | null;
    category?: {
      name?: string | null;
    } | null;
  };

  const typedProducts = productList as HomeProduct[];

  const getProductImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return normalizedPath;
  };

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-16 text-white shadow-lg sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
            Welcome to OnlineShop
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need, in one place.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
            {isAdmin
              ? "Browse the product catalogue and manage your store from the admin portal."
              : "Discover products, manage your cart, complete checkout, and keep track of your orders from one simple shopping experience."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              {isAdmin ? "View Products" : "Shop Products"}
            </Link>
            <Link
              to="/categories"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Browse Categories
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </section>

      {user ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {isAdmin ? "Admin account" : "Your account"}
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Welcome back, {user.name || user.email} 👋
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isAdmin
                  ? "Browse the store as a viewer or manage products, orders, users, and payments from the admin portal."
                  : "Continue shopping or manage your account and orders."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Admin Portal
                </Link>
              ) : (
                <Link
                  to="/orders"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  My Orders
                </Link>
              )}
              <Link
                to="/profile"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                My Profile
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">New to OnlineShop?</p>
              <h2 className="mt-1 text-2xl font-bold">Create an account and start shopping.</h2>
              <p className="mt-2 text-sm text-gray-600">
                Save your account details and keep your orders organized in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Explore
            </p>
            <h2 className="mt-1 text-3xl font-bold">Shop by Category</h2>
          </div>
          <Link to="/categories" className="hidden text-sm font-semibold underline sm:block">
            View all
          </Link>
        </div>

        {categoriesLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {categoriesError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to load categories.
          </p>
        )}

        {!categoriesLoading && !categoriesError && categoryList.length === 0 && (
          <p className="rounded-xl border p-5 text-sm text-gray-600">
            No categories available yet.
          </p>
        )}

        {!categoriesLoading && !categoriesError && categoryList.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryList.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <h3 className="mt-4 font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">Browse products</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Our selection
            </p>
            <h2 className="mt-1 text-3xl font-bold">Featured Products</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold underline">
            View all products
          </Link>
        </div>

        {productsLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {productsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-700">Failed to load products.</p>
            <p className="mt-1 text-sm text-red-600">
              Please try again or browse the Products page.
            </p>
          </div>
        )}

        {!productsLoading && !productsError && !typedProducts.length && (
          <div className="rounded-2xl border p-8 text-center">
            <p className="font-semibold">No products available.</p>
            <Link to="/products" className="mt-3 inline-block text-sm underline">
              Browse Products
            </Link>
          </div>
        )}

        {!productsLoading && !productsError && typedProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {typedProducts.slice(0, 6).map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                {getProductImageUrl(product.imageUrl) ? (
                  <img
                    src={getProductImageUrl(product.imageUrl) ?? undefined}
                    alt={product.name}
                    className="h-56 w-full object-contain bg-gray-50"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-gray-50 text-sm text-gray-500">
                    No image available
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {product.category?.name ?? "Uncategorized"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                    {product.description ?? "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="text-lg font-bold">${product.price.toLocaleString()}</p>
                    <span className="text-xs text-gray-500">
                      {product.stock} in stock
                    </span>
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="mt-5 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/products" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
          <div className="text-2xl transition-transform duration-300 group-hover:scale-110">🛍️</div>
          <h3 className="mt-4 font-semibold">Products</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {isAdmin ? "Browse the complete product catalogue." : "Explore the complete product catalogue."}
          </p>
        </Link>

        {isAdmin ? (
          <Link to="/categories" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">🏷️</div>
            <h3 className="mt-4 font-semibold">Categories</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Browse products by category.
            </p>
          </Link>
        ) : user ? (
          <Link to="/cart" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">🛒</div>
            <h3 className="mt-4 font-semibold">Shopping Cart</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review your selected products before checkout.
            </p>
          </Link>
        ) : null}

        {isAdmin ? (
          <Link to="/admin" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">⚙️</div>
            <h3 className="mt-4 font-semibold">Admin Portal</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage products, orders, users, and payments.
            </p>
          </Link>
        ) : user ? (
          <Link to="/orders" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">📦</div>
            <h3 className="mt-4 font-semibold">My Orders</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Track your order history and view order details.
            </p>
          </Link>
        ) : null}

        {user && (
          <Link to="/profile" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">👤</div>
            <h3 className="mt-4 font-semibold">My Profile</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage your account information and preferences.
            </p>
          </Link>
        )}
      </section>

      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center sm:p-12">
        <h2 className="text-3xl font-bold">
          {isAdmin ? "Ready to manage your store?" : "Ready to start shopping?"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
          {isAdmin
            ? "Open the admin portal to manage your OnlineShop operations."
            : "Browse our products and find something that fits what you need."}
        </p>
        <Link
          to={isAdmin ? "/admin" : "/products"}
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          {isAdmin ? "Open Admin Portal" : "Start Shopping"}
        </Link>
      </section>
    </div>
  );
}