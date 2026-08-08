import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export default function Categories() {
  const { categories, isLoading, error } = useCategories();
  const [search, setSearch] = useState("");
  const categoryList = Array.isArray(categories) ? categories : [];

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categoryList;
    }

    return categoryList.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categoryList, search]);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gray-950 px-6 py-14 text-white sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Explore OnlineShop
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Shop by category
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Explore our product categories and quickly find the products you are
            looking for.
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Categories
            </p>
            <h2 className="mt-1 text-3xl font-bold">Find what you need</h2>
          </div>

          <div className="w-full sm:max-w-sm">
            <label htmlFor="category-search" className="sr-only">
              Search categories
            </label>
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-700">Unable to load categories</h3>
            <p className="mt-2 text-sm text-red-600">
              Please try again later or browse our products directly.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="mt-6 rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">🔎</div>
            <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredCategories.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <article
                key={category.id}
                className="group flex min-h-52 flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl transition group-hover:bg-gray-950 group-hover:text-white">
                  🛍️
                </div>

                <h3 className="mt-5 text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {category.description ?? "Explore products in this category."}
                </p>

                <Link
                  to={`/products?categoryId=${category.id}`}
                  className="mt-5 text-sm font-semibold underline underline-offset-4 hover:text-gray-600"
                >
                  Browse products →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold">Can't find what you're looking for?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Browse the complete product catalogue and use the available product
          filters to find the right item.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
        >
          View All Products
        </Link>
      </section>
    </div>
  );
}