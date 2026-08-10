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

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await productApi.getAllProducts();
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
    console.log("[ProductsManagement] submit", {
      editing: Boolean(editingProduct),
      imageFile: imageFile?.name ?? null,
      form,
    });
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
    console.log("[ProductsManagement] validation passed", { categoryId, price, stock });

    let imageUrl = form.imageUrl.trim() || undefined;

    setSaving(true);

    try {
      if (imageFile) {
        console.log("[ProductsManagement] uploading image", imageFile.name);
        imageUrl = await productApi.uploadProductImage(imageFile);
        console.log("[ProductsManagement] image uploaded", imageUrl);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        stock,
        categoryId,
        imageUrl,
      };

      console.log("[ProductsManagement] saving payload", payload);
      if (editingProduct) {
        const id = getProductValue<string | number>(editingProduct, "id");
        console.log("[ProductsManagement] updating product", id);
        await productApi.updateProduct(Number(id), payload);
        console.log("[ProductsManagement] product updated");
      } else {
        await productApi.createProduct(payload);
      }

      await loadProducts();
      closeForm();
    } catch (err) {
      console.error("[ProductsManagement] save failed", err);
      setFormError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (product: Product) => {
    const id = getProductValue<string | number>(product, "id");
    const name = String(getProductValue<unknown>(product, "name") ?? "this product");

    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;

    setError("");

    try {
      await productApi.deleteProduct(Number(id));
      setProducts((current) => current.filter((item) => String(getProductValue<unknown>(item, "id")) !== String(id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product.");
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
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-400 mb-1">Admin &gt; Catalog</p>
          <h1 className="text-4xl font-black tracking-tight text-gray-950">Products</h1>
          <p className="mt-2 text-base text-gray-500 max-w-2xl">
            Create, update, search, and manage your store inventory.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:w-auto"
          >
            ← Dashboard
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="w-full rounded-xl bg-gray-950 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"
          >
            + Add product
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-base font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-400">Total Products</span>
          <span className="mt-2 text-2xl font-black text-gray-950">{totalProducts}</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-400">Visible Products</span>
          <span className="mt-2 text-2xl font-black text-gray-950">{visibleProducts}</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-400">Categories</span>
          <span className="mt-2 text-2xl font-black text-gray-950">{totalCategories}</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-400">Low Stock</span>
          <span className="mt-2 text-2xl font-black text-gray-950">{lowStockCount}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="search-products" className="text-xs font-bold text-gray-500 mb-1">
              Search Products
            </label>
            <input
              id="search-products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, description, or category..."
              className="min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>
          <div className="flex flex-col gap-2 md:w-60">
            <label htmlFor="category-filter" className="text-xs font-bold text-gray-500 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-medium outline-none focus:border-gray-400"
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
              className="mt-2 md:mt-0 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Result summary */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="font-bold text-gray-700">{visibleProducts}</span>
        product{visibleProducts === 1 ? "" : "s"} found
        {activeSearch && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ml-2">
            Search: &quot;{search.trim()}&quot;
          </span>
        )}
        {activeCategory && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ml-2">
            Category: {categoryFilter}
          </span>
        )}
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-5">
          <div>
            <h2 className="font-black text-gray-950 text-lg">Product catalog</h2>
            <p className="mt-1 text-xs text-gray-500">
              {loading
                ? "Loading..."
                : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-base text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-2xl font-black text-gray-800 mb-2">No products found</p>
            <p className="text-base text-gray-500 mb-2">Try another search or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
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

                  return (
                    <tr key={id} className="transition hover:bg-gray-50/70">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={name}
                                className="h-full w-full object-contain p-1"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">No image</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-gray-900">{name}</p>
                            <p className="mt-1 text-xs text-gray-400">ID: {id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-base text-gray-600">{categoryName}</td>
                      <td className="px-6 py-5 text-base font-bold text-gray-900">{formatCurrency(price)}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            stock <= 5 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {stock} units
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(product)}
                            className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6">
              <div>
                <h2 className="font-black text-2xl text-gray-950">{editingProduct ? "Edit product" : "Add product"}</h2>
                <p className="mt-1 text-xs text-gray-500">Keep product information accurate for customers.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
              {formError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}
              <div>
                <h3 className="mb-4 text-sm font-black text-gray-700 tracking-wide uppercase">Product information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Name</span>
                    <input
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      required
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      rows={4}
                      className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Stock</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Category</span>
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
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
                    <label className="text-xs font-bold text-gray-500 mb-1" htmlFor="create-category-input">
                      Create category
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="create-category-input"
                        type="text"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      />
                      <button
                        type="button"
                        className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
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
                    <span className="mb-1.5 block text-sm font-bold text-gray-700">Product image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />
                    <span className="mt-1.5 block text-xs text-gray-400">
                      PNG, JPG, or WebP. Choose a file from your computer instead of entering an image URL.
                    </span>
                    {imageFile && (
                      <span className="mt-1 block text-xs font-medium text-gray-600">Selected: {imageFile.name}</span>
                    )}
                  </label>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => console.log("[ProductsManagement] Save button clicked")}
                  disabled={saving}
                  className="rounded-xl bg-gray-950 px-6 py-3 text-base font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
