import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { user } = useAuth();

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

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-white sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
            Welcome to OnlineShop
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need, in one place.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Discover products, manage your cart, complete checkout, and keep track
            of your orders from one simple shopping experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-200"
            >
              Shop Products
            </Link>
            <Link
              to="/categories"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {user ? (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Your account</p>
              <h2 className="mt-1 text-2xl font-bold">
                Welcome back, {user.name || user.email} 👋
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Continue shopping or manage your account and orders.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/orders"
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              >
                My Profile
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
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
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
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
                className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl transition group-hover:bg-gray-950 group-hover:text-white">
                  🛍️
                </div>
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
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
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
                    className="mt-5 block rounded-xl bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
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
        <Link to="/products" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-2xl">🛍️</div>
          <h3 className="mt-4 font-semibold">Products</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Explore the complete product catalogue.
          </p>
        </Link>

        <Link to="/cart" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-2xl">🛒</div>
          <h3 className="mt-4 font-semibold">Shopping Cart</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Review your selected products before checkout.
          </p>
        </Link>

        <Link to="/orders" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-2xl">📦</div>
          <h3 className="mt-4 font-semibold">My Orders</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Track your order history and view order details.
          </p>
        </Link>

        <Link to="/profile" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="text-2xl">👤</div>
          <h3 className="mt-4 font-semibold">My Profile</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Manage your account information and preferences.
          </p>
        </Link>
      </section>

      <section className="rounded-2xl border bg-gray-100 p-8 text-center sm:p-12">
        <h2 className="text-3xl font-bold">Ready to start shopping?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
          Browse our products and find something that fits what you need.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Start Shopping
        </Link>
      </section>
    </div>
  );
}