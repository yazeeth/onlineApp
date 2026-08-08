import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, logoutLoading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = () => {
    setAccountOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="shrink-0 text-2xl font-bold tracking-tight">
          OnlineShop
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium hover:text-gray-600">
            Home
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-gray-600">
            Categories
          </Link>
          <Link to="/products" className="text-sm font-medium hover:text-gray-600">
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-32 truncate sm:inline">
                  {user.name || user.email}
                </span>
                <span aria-hidden="true">⌄</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border bg-white p-2 shadow-lg">
                  <div className="border-b px-3 py-2">
                    <p className="truncate text-sm font-semibold">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    My Cart
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="mt-1 w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-gray-600">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t md:hidden">
        <nav className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-6 py-3">
          <Link to="/" className="whitespace-nowrap text-sm font-medium">
            Home
          </Link>
          <Link to="/categories" className="whitespace-nowrap text-sm font-medium">
            Categories
          </Link>
          <Link to="/products" className="whitespace-nowrap text-sm font-medium">
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}