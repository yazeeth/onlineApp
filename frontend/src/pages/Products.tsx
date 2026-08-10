import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";

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
  image?: string | null;
  imageUrl?: string | null;
  category?: ProductCategory | null;
};

const getProductImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return normalizedPath;
};

function Products() {
  const { products, isLoading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const searchTerm = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sort") ?? "featured";
  const stockFilter = searchParams.get("stock") ?? "all";

  const updateFilterParam = (key: string, value: string, defaultValue: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const productList = (Array.isArray(products) ? products : []) as DisplayProduct[];

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = productList.filter((product) => {
      const matchesCategory = !categoryId || String(product.category?.id ?? "") === categoryId;
      const searchableText = `${product.name} ${product.description ?? ""} ${product.category?.name ?? ""}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "out-of-stock" && product.stock <= 0);

      return matchesCategory && matchesSearch && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "stock":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }, [productList, categoryId, searchTerm, sortBy, stockFilter]);

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.delete("sort");
    nextParams.delete("stock");
    setSearchParams(nextParams);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-gray-950 px-6 py-12 text-white sm:px-10">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-800" />
          <div className="mt-4 h-10 w-52 animate-pulse rounded bg-gray-800" />
          <div className="mt-4 h-5 max-w-xl animate-pulse rounded bg-gray-800" />
          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-gray-800" />
        </section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="h-56 animate-pulse bg-gray-100" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">OnlineShop</p>
        <h1 className="mt-1 text-xl font-semibold text-red-700">Failed to load products</h1>
        <p className="mt-2 text-sm text-red-600">Please try again later.</p>
      </div>
    );
  }

  const hasActiveFilters = Boolean(searchTerm.trim()) || sortBy !== "featured" || stockFilter !== "all";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gray-950 px-6 py-10 text-white shadow-sm sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">OnlineShop</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Find your next product</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Search our catalogue, filter by availability, and sort products to quickly find what you need.
            </p>
          </div>
          <p className="text-sm text-gray-400">{filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">⌕</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateFilterParam("search", event.target.value, "")}
              placeholder="Search products, descriptions, or categories..."
              aria-label="Search products"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-gray-400"
            />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => updateFilterParam("search", "", "")}
              className="rounded-xl border border-gray-700 px-5 py-3.5 text-sm font-semibold text-gray-200 transition hover:bg-gray-800"
            >
              Clear Search
            </button>
          )}
        </div>
      </section>

      {categoryId && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Category filter</p>
            <p className="mt-1 font-semibold text-gray-900">Showing products from the selected category</p>
          </div>
          <Link
            to="/products"
            className="inline-flex w-fit rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
          >
            Clear Category
          </Link>
        </div>
      )}

      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Browse products</p>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} matching product{filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="whitespace-nowrap">Availability</span>
              <select
                value={stockFilter}
                onChange={(event) => updateFilterParam("stock", event.target.value, "all")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-black"
              >
                <option value="all">All products</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="whitespace-nowrap">Sort</span>
              <select
                value={sortBy}
                onChange={(event) => updateFilterParam("sort", event.target.value, "featured")}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-black"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
                <option value="stock">Stock: Highest First</option>
              </select>
            </label>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Active filters</span>
            {searchTerm.trim() && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Search: {searchTerm.trim()}
              </span>
            )}
            {stockFilter !== "all" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {stockFilter === "in-stock" ? "In stock" : "Out of stock"}
              </span>
            )}
            {sortBy !== "featured" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Sorted
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-semibold text-gray-700 underline underline-offset-4 hover:text-black"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {!filteredProducts.length ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">⌕</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No products found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Try a different search term or clear your filters to see more products.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;
            const productImageUrl = getProductImageUrl(product.image ?? product.imageUrl);

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/products/${product.id}`} className="relative block overflow-hidden">
                  {productImageUrl ? (
                    <img
                      src={productImageUrl}
                      alt={product.name}
                      className="h-56 w-full object-contain bg-gray-50 transition duration-300 group-hover:scale-105"
                      onError={(event) => {
                        console.error("Product image failed to load:", productImageUrl);
                        event.currentTarget.style.display = "none";
                        const fallback = event.currentTarget.parentElement?.querySelector("[data-image-fallback]") as HTMLElement | null;
                        fallback?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    data-image-fallback
                    className={`${productImageUrl ? "hidden " : ""}flex h-56 w-full items-center justify-center bg-gray-100 text-sm text-gray-500`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl" aria-hidden="true">🖼️</span>
                      <span>No image available</span>
                    </div>
                  </div>

                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                      {product.category?.name ?? "Uncategorized"}
                    </span>
                    {isOutOfStock && (
                      <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        Out of stock
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {product.category?.name ?? "Uncategorized"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                    {product.description ?? "No description available."}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-gray-950">
                          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {isLowStock ? (
                          <p className="mt-1 text-xs font-semibold text-amber-600">Only {product.stock} left</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">
                            {product.stock} in stock
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className={`mt-5 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                        isOutOfStock
                          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          : "bg-gray-950 text-white hover:bg-gray-700"
                      }`}
                    >
                      {isOutOfStock ? "View Details" : "View Product"}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;
