import { useEffect, useMemo, useState } from "react";
import { userApi } from "../../api/userApi";
import {
  addAdminCustomerAddress,
  editAdminCustomerAddress,
  getAdminCustomerAddresses,
  removeAdminCustomerAddress,
} from "../../api/addressApi";
import type { Address, CreateAddressInput } from "../../api/addressApi";
import type { User } from "../../types/user.types";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedAddressUser, setSelectedAddressUser] = useState<User | null>(null);
  const [customerAddresses, setCustomerAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<CreateAddressInput>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const loadCustomerAddresses = async (userId: number) => {
    try {
      setAddressLoading(true);
      setAddressError(null);
      const addresses = await getAdminCustomerAddresses(userId);
      setCustomerAddresses(addresses);
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : "Failed to load customer addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const openAddressManager = async (user: User) => {
    setSelectedAddressUser(user);
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressForm({
      fullName: user.name ?? "",
      phone: user.phone ?? "",
      street: "",
      city: "",
      country: "",
      postalCode: "",
    });
    await loadCustomerAddresses(Number(user.id));
  };

  const closeAddressManager = () => {
    setSelectedAddressUser(null);
    setCustomerAddresses([]);
    setAddressError(null);
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      fullName: selectedAddressUser?.name ?? "",
      phone: selectedAddressUser?.phone ?? "",
      street: "",
      city: "",
      country: "",
      postalCode: "",
    });
    setShowAddressForm(true);
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
    });
    setShowAddressForm(true);
  };

  const saveCustomerAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAddressUser) return;

    try {
      setAddressLoading(true);
      setAddressError(null);
      if (editingAddress) {
        await editAdminCustomerAddress(Number(selectedAddressUser.id), Number(editingAddress.id), addressForm);
      } else {
        await addAdminCustomerAddress(Number(selectedAddressUser.id), addressForm);
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      await loadCustomerAddresses(Number(selectedAddressUser.id));
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : "Failed to save customer address");
      setAddressLoading(false);
    }
  };

  const deleteCustomerAddress = async (addressId: number) => {
    if (!selectedAddressUser) return;
    if (!window.confirm("Delete this customer address?")) return;
    try {
      setAddressLoading(true);
      setAddressError(null);
      await removeAdminCustomerAddress(Number(selectedAddressUser.id), addressId);
      await loadCustomerAddresses(Number(selectedAddressUser.id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      setAddressError(
        errorMessage.includes("Order_addressId_fkey") ||
        errorMessage.includes("Foreign key constraint violated")
          ? "Cannot delete this address. It is tied to one or more existing orders."
          : errorMessage || "Failed to delete customer address",
      );
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userApi.getAllUsers() as
          | User[]
          | { users?: User[] }
          | null
          | undefined;
        if (mounted) {
          const userList = Array.isArray(response)
            ? response
            : Array.isArray(response?.users)
              ? response.users
              : [];

          setUsers(userList);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.id, user.name, user.email, user.role]
        .map((value) => String(value ?? "").toLowerCase())
        .some((value) => value.includes(query)),
    );
  }, [users, search]);

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
    setError(null);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setActionLoading(Number(editingUser.id));
      setError(null);
      const response = await userApi.updateUser(Number(editingUser.id), editForm);
      const updatedUser = response?.user ?? response;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedUser } : user,
        ),
      );
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (user: User) => {
    const nextRole = String(user.role).toUpperCase() === "ADMIN" ? "CUSTOMER" : "ADMIN";
    const confirmed = window.confirm(
      `Change ${user.name ?? "this user"}'s role to ${nextRole}?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(Number(user.id));
      setError(null);
      const response = await userApi.updateRole(Number(user.id), { role: nextRole });
      const updatedUser = response?.user ?? response;

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, ...updatedUser, role: updatedUser?.role ?? nextRole }
            : currentUser,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(
      `Delete ${user.name ?? "this user"}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(Number(user.id));
      setError(null);
      await userApi.deleteUser(Number(user.id));
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--background)] space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Users Management</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
              Manage customers, administrator roles, and user accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-fit items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--text-accent)] shadow-sm transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-[var(--text-muted)]">
            {search.trim() ? `${filteredUsers.length} matching users` : `${users.length} users`}
          </p>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-accent)] focus:ring-[var(--brand-accent)]/20 sm:w-80"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-5 shadow-sm transition hover:border-[var(--brand-accent)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-accent)]">Total Users</p>
          <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-5 shadow-sm transition hover:border-[var(--brand-accent)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-accent)]">Administrators</p>
          <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">
            {users.filter((user) => String(user.role).toUpperCase() === "ADMIN").length}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-5 shadow-sm transition hover:border-[var(--brand-accent)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-accent)]">Customers</p>
          <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">
            {users.filter((user) => String(user.role).toUpperCase() !== "ADMIN").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--text-secondary)]">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-secondary)]">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-secondary)]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-accent)]">User</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-accent)]">Contact</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-accent)]">Role</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-accent)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface-secondary)]">
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                          {user.name ?? "Unnamed user"}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">
                          #{user.id ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[var(--text-secondary)]">{user.email ?? "—"}</p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{user.phone ?? "No phone number"}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            String(user.role).toUpperCase() === "ADMIN"
                              ? "border border-blue-700 bg-blue-950/60 text-blue-200"
                              : "border border-slate-600 bg-slate-800/70 text-slate-200"
                          }`}
                        >
                          {String(user.role ?? "CUSTOMER").toUpperCase()}
                        </span>
                        <button
                          type="button"
                          disabled={actionLoading === Number(user.id)}
                          onClick={() => void handleRoleChange(user)}
                          className="text-xs font-bold text-[var(--text-accent)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {String(user.role).toUpperCase() === "ADMIN" ? "Demote" : "Promote"}
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right text-sm">
                      <div className="flex flex-wrap justify-end gap-2">
                        {String(user.role).toUpperCase() !== "ADMIN" && (
                          <button
                            type="button"
                            onClick={() => void openAddressManager(user)}
                            disabled={actionLoading === Number(user.id)}
                            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs font-bold text-[var(--text-accent)] transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Address
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditUser(user)}
                          disabled={actionLoading === Number(user.id)}
                          className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs font-bold text-[var(--text-accent)] transition hover:border-[var(--brand-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteUser(user)}
                          disabled={actionLoading === Number(user.id)}
                          className="rounded-lg border border-red-700 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-200 transition hover:border-red-500 hover:bg-red-900/70 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedAddressUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Customer Addresses</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedAddressUser.name ?? "Customer"} · {selectedAddressUser.email ?? "—"}</p>
              </div>
              <button type="button" onClick={closeAddressManager} className="text-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close">×</button>
            </div>

            {addressError && <div className="mt-5 rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">{addressError}</div>}

            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-secondary)]">{addressLoading ? "Loading addresses..." : `${customerAddresses.length} saved address${customerAddresses.length === 1 ? "" : "es"}`}</p>
              <button type="button" onClick={openAddAddress} className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-slate-100 hover:bg-[var(--brand-primary-dark)]">+ Add Address</button>
            </div>

            {showAddressForm && (
              <form onSubmit={(event) => void saveCustomerAddress(event)} className="mt-5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-5">
                <h3 className="text-base font-black text-[var(--text-primary)]">{editingAddress ? "Edit Address" : "Add Address"}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {([
                    ["fullName", "Full name"],
                    ["phone", "Phone"],
                    ["street", "Street"],
                    ["city", "City"],
                    ["country", "Country"],
                    ["postalCode", "Postal code"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">{label}</span>
                      <input value={addressForm[field]} onChange={(event) => setAddressForm((form) => ({ ...form, [field]: event.target.value }))} required className="mt-1 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-accent)]" />
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-2 text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--text-primary)]">Cancel</button>
                  <button type="submit" disabled={addressLoading} className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-slate-100 hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50">{addressLoading ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}</button>
                </div>
              </form>
            )}

            <div className="mt-5 space-y-3">
              {!addressLoading && customerAddresses.length === 0 && <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-6 text-center text-sm text-[var(--text-secondary)]">No saved addresses for this customer.</div>}
              {customerAddresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1 text-sm">
                      <p className="font-bold text-[var(--text-primary)]">{address.fullName}</p>
                      <p className="text-[var(--text-secondary)]">{address.phone}</p>
                      <p className="text-[var(--text-secondary)]">{address.street}</p>
                      <p className="text-[var(--text-secondary)]">{address.city}, {address.postalCode}</p>
                      <p className="text-[var(--text-muted)]">{address.country}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => openEditAddress(address)} disabled={addressLoading} className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-accent)] transition hover:border-[var(--brand-accent)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50">Edit</button>
                      <button type="button" onClick={() => void deleteCustomerAddress(Number(address.id))} disabled={addressLoading} className="rounded-lg border border-red-700 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-200 transition hover:border-red-500 hover:bg-red-900/70 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] p-6 sm:p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Edit User</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Update the selected user's account details.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Name</span>
                <input
                  value={editForm.name}
                  onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((form) => ({ ...form, email: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Phone</span>
                <input
                  value={editForm.phone}
                  onChange={(event) => setEditForm((form) => ({ ...form, phone: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-accent)]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-2 text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleUpdateUser()}
                disabled={actionLoading === Number(editingUser.id)}
                className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-slate-100 hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading === Number(editingUser.id) ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}