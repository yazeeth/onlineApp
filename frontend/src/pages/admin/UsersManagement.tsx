import { useEffect, useMemo, useState } from "react";
import { userApi } from "../../api/userApi";
import type { User } from "../../types/user.types";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-950">Users Management</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage customers, administrator roles, and user accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-fit items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-gray-400">
            {search.trim() ? `${filteredUsers.length} matching users` : `${users.length} users`}
          </p>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 sm:w-80"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Users</p>
          <p className="mt-1 text-2xl font-black text-gray-950">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Administrators</p>
          <p className="mt-1 text-2xl font-black text-gray-950">
            {users.filter((user) => String(user.role).toUpperCase() === "ADMIN").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Customers</p>
          <p className="mt-1 text-2xl font-black text-gray-950">
            {users.filter((user) => String(user.role).toUpperCase() !== "ADMIN").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user.name ?? "Unnamed user"}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-gray-400">
                          #{user.id ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-gray-700">{user.email ?? "—"}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{user.phone ?? "No phone number"}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            String(user.role).toUpperCase() === "ADMIN"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {String(user.role ?? "CUSTOMER").toUpperCase()}
                        </span>
                        <button
                          type="button"
                          disabled={actionLoading === Number(user.id)}
                          onClick={() => void handleRoleChange(user)}
                          className="text-xs font-bold text-gray-500 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {String(user.role).toUpperCase() === "ADMIN" ? "Demote" : "Promote"}
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right text-sm">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditUser(user)}
                          disabled={actionLoading === Number(user.id)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteUser(user)}
                          disabled={actionLoading === Number(user.id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-950">Edit User</h2>
                <p className="mt-1 text-sm text-gray-500">Update the selected user's account details.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-xl text-gray-400 hover:text-gray-900"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Name</span>
                <input
                  value={editForm.name}
                  onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((form) => ({ ...form, email: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Phone</span>
                <input
                  value={editForm.phone}
                  onChange={(event) => setEditForm((form) => ({ ...form, phone: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleUpdateUser()}
                disabled={actionLoading === Number(editingUser.id)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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