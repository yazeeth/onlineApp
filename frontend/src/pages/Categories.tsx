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
      <section className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 text-white shadow-lg sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
            Explore OnlineShop
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Shop by category
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
            Explore our product categories and quickly find the products you are
            looking for.
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
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
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h3 className="font-semibold text-red-700">Unable to load categories</h3>
            <p className="mt-2 text-sm text-red-600">
              Please try again later or browse our products directly.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
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
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="group flex min-h-64 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-500 transition group-hover:text-brand-700">
                    Category
                  </span>
                </div>

                <div className="mt-8 flex flex-1 flex-col">
                  <h3 className="text-xl font-bold tracking-tight text-gray-950 transition group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {category.description ?? "Explore products in this category."}
                  </p>

                  <span className="mt-6 inline-flex items-center text-sm font-bold text-brand-600 transition group-hover:translate-x-1 group-hover:text-brand-700">
                    Browse products <span className="ml-2" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold">Can't find what you're looking for?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Browse the complete product catalogue and use the available product
          filters to find the right item.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          View All Products
        </Link>
      </section>
    </div>
  );
}