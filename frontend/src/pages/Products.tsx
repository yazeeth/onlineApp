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
  imageUrl?: string | null;
  category?: ProductCategory | null;
};

function Products() {
  const { products, isLoading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const productList = (Array.isArray(products) ? products : []) as DisplayProduct[];

  const filteredProducts = useMemo(() => {
    if (!categoryId) {
      return productList;
    }

    return productList.filter((product) => {
      return String(product.category?.id ?? "") === categoryId;
    });
  }, [productList, categoryId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-96 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-700">Failed to load products</h1>
        <p className="mt-2 text-sm text-red-600">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gray-950 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          OnlineShop
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Products</h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Browse our product catalogue and find something that fits your needs.
        </p>
      </section>

      {categoryId && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Category filter</p>
            <p className="mt-1 font-semibold">
              Showing products from the selected category
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex w-fit rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Clear Filter
          </Link>
        </div>
      )}

      {!filteredProducts.length ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">🛍️</div>
          <h2 className="mt-4 text-xl font-semibold">
            {categoryId ? "No products in this category" : "No products available"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {categoryId
              ? "Try another category or view all products."
              : "Products will appear here when they become available."}
          </p>
          {categoryId && (
            <Link
              to="/products"
              className="mt-5 inline-block rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
            >
              View All Products
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
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
                <div className="flex h-56 w-full items-center justify-center bg-gray-100 text-gray-500">
                  No image
                </div>
              )}

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {product.category?.name ?? "Uncategorized"}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                  {product.description ?? "No description available."}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-lg font-bold">
                    ${product.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.stock} in stock
                  </p>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="mt-5 block rounded-xl bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
