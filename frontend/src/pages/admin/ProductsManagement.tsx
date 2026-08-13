import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product.types";
type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
};
type Category = {
  id: number;
  name: string;
};
const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
};

function getProductValue<T>(product: Product, key: string): T | undefined {
  return (product as Product & Record<string, unknown>)[key] as T | undefined;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductsManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [permanentDeleteProduct, setPermanentDeleteProduct] = useState<Product | null>(null);
  const [permanentDeleteName, setPermanentDeleteName] = useState("");
  const [permanentDeletePassword, setPermanentDeletePassword] = useState("");
  const [permanentDeleteError, setPermanentDeleteError] = useState("");
  const [permanentDeleting, setPermanentDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await productApi.getAllProductsForAdmin();
      setProducts(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
    void (async () => {
      try {
        const result = await categoryApi.getCategories();
        setAvailableCategories(result ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load categories.");
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const values = products.map((product) => {
      const category = getProductValue<unknown>(product, "category");
      if (typeof category === "string") return category;
      if (category && typeof category === "object") {
        const value = (category as { name?: unknown }).name;
        return typeof value === "string" ? value : "Uncategorized";
      }
      return "Uncategorized";
    });

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = String(getProductValue<unknown>(product, "name") ?? "");
      const description = String(getProductValue<unknown>(product, "description") ?? "");
      const category = getProductValue<unknown>(product, "category");
      const categoryName =
        typeof category === "string"
          ? category
          : category && typeof category === "object"
            ? String((category as { name?: unknown }).name ?? "Uncategorized")
            : "Uncategorized";

      const matchesSearch = !query || `${name} ${description} ${categoryName}`.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError("");
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: String(getProductValue<unknown>(product, "name") ?? ""),
      description: String(getProductValue<unknown>(product, "description") ?? ""),
      price: String(getProductValue<unknown>(product, "price") ?? ""),
      stock: String(getProductValue<unknown>(product, "stock") ?? ""),
      categoryId: String(
        getProductValue<unknown>(product, "categoryId") ??
          (getProductValue<{ id?: unknown }>(product, "category")?.id ?? ""),
      ),
      imageUrl: String(
        getProductValue<unknown>(product, "imageUrl") ??
        getProductValue<unknown>(product, "image") ??
        "",
      ),
    });
    setFormError("");
    setImageFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid non-negative price.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("Stock must be a non-negative whole number.");
      return;
    }

    const categoryId = Number(form.categoryId);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setFormError("Please select a category.");
      return;
    }

    let imageUrl = form.imageUrl.trim() || undefined;

    setSaving(true);

    try {
      if (imageFile) {
        imageUrl = await productApi.uploadProductImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        stock,
        categoryId,
        imageUrl,
      };

      if (editingProduct) {
        const id = getProductValue<string | number>(editingProduct, "id");
        await productApi.updateProduct(Number(id), payload);
      } else {
        await productApi.createProduct(payload);
      }

      await loadProducts();
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (product: Product) => {
    const id = getProductValue<string | number>(product, "id");
    const name = String(getProductValue<unknown>(product, "name") ?? "this product");

    if (!window.confirm(`Archive ${name}? It will no longer appear in the customer catalog.`)) return;

    setError("");

    try {
      await productApi.archiveProduct(Number(id));
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to archive product.");
    }
  };

  const handleRestore = async (product: Product) => {
    const id = getProductValue<string | number>(product, "id");
    const name = String(getProductValue<unknown>(product, "name") ?? "this product");

    if (!window.confirm(`Restore ${name}? It will appear in the customer catalog again.`)) return;

    setError("");

    try {
      await productApi.restoreProduct(Number(id));
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restore product.");
    }
  };

  const openPermanentDelete = (product: Product) => {
    setPermanentDeleteProduct(product);
    setPermanentDeleteName("");
    setPermanentDeletePassword("");
    setPermanentDeleteError("");
  };

  const closePermanentDelete = () => {
    if (permanentDeleting) return;
    setPermanentDeleteProduct(null);
    setPermanentDeleteName("");
    setPermanentDeletePassword("");
    setPermanentDeleteError("");
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteProduct) return;

    const id = getProductValue<string | number>(permanentDeleteProduct, "id");
    const productName = String(
      getProductValue<unknown>(permanentDeleteProduct, "name") ?? "",
    );

    if (permanentDeleteName.trim() !== productName) {
      setPermanentDeleteError("Type the exact product name to confirm permanent deletion.");
      return;
    }

    if (!permanentDeletePassword) {
      setPermanentDeleteError("Admin password is required.");
      return;
    }

    setPermanentDeleteError("");
    setPermanentDeleting(true);
    setError("");

    try {
      await productApi.permanentlyDeleteProduct(
        Number(id),
        permanentDeletePassword,
      );
      closePermanentDelete();
      await loadProducts();
    } catch (err) {
      setPermanentDeleteError(
        err instanceof Error ? err.message : "Unable to permanently delete product.",
      );
    } finally {
      setPermanentDeleting(false);
    }
  };

  // Summary calculations
  const totalProducts = products.length;
  const visibleProducts = filteredProducts.length;
  const totalCategories = categories.length;
  const lowStockCount = products.filter(
    (p) => Number(getProductValue<unknown>(p, "stock") ?? 0) <= 5
  ).length;
  const activeSearch = search.trim().length > 0;
  const activeCategory = categoryFilter !== "all";

  return (
    <div className="mx-auto min-h-full w-full max-w-7xl bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-[var(--text-accent)]">Admin &gt; Catalog</p>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Products</h1>
          <p className="mt-2 max-w-2xl text-base leading-6 text-[var(--text-secondary)]">
            Create, update, search, and manage your store inventory.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3 text-base font-bold text-[var(--text-accent)] shadow-sm transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] sm:w-auto"
          >
            ← Dashboard
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="w-full rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-base font-bold text-[var(--text-primary)] shadow-sm transition hover:bg-[var(--brand-primary-dark)] sm:w-auto"
          >
            + Add product
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-800 bg-red-950/60 px-6 py-4 text-base font-semibold text-danger-500 shadow-sm">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm transition hover:border-[var(--brand-accent)] hover:shadow-md">
          <span className="text-xs font-bold uppercase text-[var(--text-accent)]">Total Products</span>
          <span className="mt-2 text-2xl font-black text-[var(--text-primary)]">{totalProducts}</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm transition hover:border-[var(--brand-accent)] hover:shadow-md">
          <span className="text-xs font-bold uppercase text-[var(--text-accent)]">Visible Products</span>
          <span className="mt-2 text-2xl font-black text-[var(--text-primary)]">{visibleProducts}</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm transition hover:border-[var(--brand-accent)] hover:shadow-md">
          <span className="text-xs font-bold uppercase text-[var(--text-accent)]">Categories</span>
          <span className="mt-2 text-2xl font-black text-[var(--text-primary)]">{totalCategories}</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm transition hover:border-[var(--brand-accent)] hover:shadow-md">
          <span className="text-xs font-bold uppercase text-[var(--text-accent)]">Low Stock</span>
          <span className="mt-2 text-2xl font-black text-[var(--text-primary)]">{lowStockCount}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="search-products" className="mb-1 text-xs font-bold text-[var(--text-secondary)]">
              Search Products
            </label>
            <input
              id="search-products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, description, or category..."
              className="min-w-0 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
            />
          </div>
          <div className="flex flex-col gap-2 md:w-60">
            <label htmlFor="category-filter" className="mb-1 text-xs font-bold text-[var(--text-secondary)]">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base font-medium text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex md:items-end">
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-6 py-3 text-base font-bold text-[var(--text-secondary)] transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-accent)] md:mt-0"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Result summary */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="font-bold text-[var(--text-primary)]">{visibleProducts}</span>
        product{visibleProducts === 1 ? "" : "s"} found
        {activeSearch && (
          <span className="ml-2 rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
            Search: &quot;{search.trim()}&quot;
          </span>
        )}
        {activeCategory && (
          <span className="ml-2 rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
            Category: {categoryFilter}
          </span>
        )}
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-secondary)] px-6 py-5">
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)]">Product catalog</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {loading
                ? "Loading..."
                : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-base text-[var(--text-secondary)]">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="mb-2 text-2xl font-black text-[var(--text-primary)]">No products found</p>
            <p className="mb-2 text-base text-[var(--text-secondary)]">Try another search or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                <tr>
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredProducts.map((product) => {
                  const id = String(getProductValue<unknown>(product, "id"));
                  const name = String(getProductValue<unknown>(product, "name") ?? "Product");
                  const price = Number(getProductValue<unknown>(product, "price") ?? 0);
                  const stock = Number(getProductValue<unknown>(product, "stock") ?? 0);
                  const imageValue =
                    getProductValue<unknown>(product, "imageUrl") ??
                    getProductValue<unknown>(product, "image") ??
                    "";
                  const imageUrl = typeof imageValue === "string" ? imageValue : "";
                  const category = getProductValue<unknown>(product, "category");
                  const categoryName =
                    typeof category === "string"
                      ? category
                      : category && typeof category === "object"
                        ? String((category as { name?: unknown }).name ?? "Uncategorized")
                        : "Uncategorized";
                  const active = getProductValue<boolean>(product, "active") !== false;

                  return (
                    <tr key={id} className="transition hover:bg-[var(--surface-secondary)]">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={name}
                                className="h-full w-full object-contain p-1"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--text-muted)]">No image</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-[var(--text-primary)]">{name}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">ID: {id}</p>
                            <span
                              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                active
                                  ? "bg-emerald-950/60 text-emerald-300"
                                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                              }`}
                            >
                              {active ? "Active" : "Archived"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-base text-[var(--text-secondary)]">{categoryName}</td>
                      <td className="px-6 py-5 text-base font-bold text-[var(--text-primary)]">{formatCurrency(price)}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            stock <= 5 ? "bg-red-950/60 text-red-300" : "bg-emerald-950/60 text-emerald-300"
                          }`}
                        >
                          {stock} units
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          {active ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openEdit(product)}
                                className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-accent)]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleArchive(product)}
                                className="rounded-lg border border-amber-800 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-950/70"
                              >
                                Archive
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => void handleRestore(product)}
                                className="rounded-lg border border-emerald-800 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-950/70"
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                onClick={() => openPermanentDelete(product)}
                                className="rounded-lg border border-red-800 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-950/70"
                              >
                                Permanent delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {permanentDeleteProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="permanent-delete-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] shadow-2xl">
            <div className="border-b border-red-800 bg-red-950/60 px-6 py-5">
              <h2 id="permanent-delete-title" className="text-xl font-black text-red-300">
                Permanently delete product?
              </h2>
              <p className="mt-2 text-sm leading-6 text-red-300">
                This action cannot be undone. Only permanently delete products that were created accidentally.
                Historical-order protection is also enforced by the backend.
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">Product</p>
                <p className="mt-1 text-base font-black text-[var(--text-primary)]">
                  {String(getProductValue<unknown>(permanentDeleteProduct, "name") ?? "Product")}
                </p>
              </div>

              {permanentDeleteError && (
                <div className="rounded-xl border border-red-800 bg-red-950/60 px-4 py-3 text-sm font-semibold text-danger-500">
                  {permanentDeleteError}
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">
                  Type the product name to confirm
                </span>
                <input
                  type="text"
                  value={permanentDeleteName}
                  onChange={(event) => setPermanentDeleteName(event.target.value)}
                  placeholder={String(getProductValue<unknown>(permanentDeleteProduct, "name") ?? "")}
                  disabled={permanentDeleting}
                  autoComplete="off"
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-[var(--surface-secondary)] placeholder:text-[var(--text-muted)]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">
                  Admin password
                </span>
                <input
                  type="password"
                  value={permanentDeletePassword}
                  onChange={(event) => setPermanentDeletePassword(event.target.value)}
                  disabled={permanentDeleting}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-[var(--surface-secondary)] placeholder:text-[var(--text-muted)]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePermanentDelete}
                  disabled={permanentDeleting}
                  className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handlePermanentDelete()}
                  disabled={permanentDeleting}
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {permanentDeleting ? "Deleting..." : "Permanently delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--surface)] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-8 py-6">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)]">{editingProduct ? "Edit product" : "Add product"}</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Keep product information accurate for customers.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl px-3 py-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
              {formError && (
                <div className="mb-4 rounded-xl border border-red-800 bg-red-950/60 px-4 py-3 text-sm font-semibold text-danger-500">
                  {formError}
                </div>
              )}
              <div>
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[var(--text-accent)]">Product information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Name</span>
                    <input
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      rows={4}
                      className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Stock</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Category</span>
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                      required
                    >
                      <option value="">Select category</option>
                      {availableCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* Create category control */}
                  <div className="flex flex-col gap-1">
                    <label className="mb-1 text-xs font-bold text-[var(--text-secondary)]" htmlFor="create-category-input">
                      Create category
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="create-category-input"
                        type="text"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                      />
                      <button
                        type="button"
                        className="rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-xs font-bold text-[var(--text-primary)] transition hover:bg-[var(--brand-primary-dark)]"
                        onClick={async () => {
                          setCategoryError("");
                          const trimmed = categoryName.trim();
                          if (!trimmed) {
                            setCategoryError("Category name is required.");
                            return;
                          }
                          try {
                            // Use existing API method if available
                            if (typeof categoryApi.createCategory === "function") {
                              await categoryApi.createCategory({ name: trimmed });
                              const result = await categoryApi.getCategories();
                              setAvailableCategories(result ?? []);
                              setCategoryName("");
                              setCategoryError("");
                            } else {
                              setCategoryError("Category creation not supported.");
                            }
                          } catch (err) {
                            setCategoryError(
                              err instanceof Error ? err.message : "Unable to create category."
                            );
                          }
                        }}
                      >
                        Create
                      </button>
                    </div>
                    {categoryError && (
                      <div className="mt-1 text-xs text-red-600 font-medium">{categoryError}</div>
                    )}
                  </div>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-[var(--text-secondary)]">Product image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 placeholder:text-[var(--text-muted)]"
                    />
                    <span className="mt-1.5 block text-xs text-[var(--text-muted)]">
                      PNG, JPG, or WebP. Choose a file from your computer instead of entering an image URL.
                    </span>
                    {imageFile && (
                      <span className="mt-1 block text-xs font-medium text-[var(--text-secondary)]">Selected: {imageFile.name}</span>
                    )}
                  </label>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-3 rounded-b-2xl border-t border-[var(--border)] bg-[var(--surface-secondary)] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3 text-base font-bold text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-base font-bold text-[var(--text-primary)] transition hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingProduct ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
