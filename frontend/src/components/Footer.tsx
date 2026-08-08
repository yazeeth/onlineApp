

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="text-2xl font-bold text-white">
            OnlineShop
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            A simple and reliable online shopping experience for discovering
            products, managing your cart, and tracking your orders.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Shop
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/products" className="hover:text-white">
              Products
            </Link>
            <Link to="/categories" className="hover:text-white">
              Categories
            </Link>
            <Link to="/cart" className="hover:text-white">
              Shopping Cart
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Account
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/login" className="hover:text-white">
              Login
            </Link>
            <Link to="/register" className="hover:text-white">
              Register
            </Link>
            <Link to="/profile" className="hover:text-white">
              My Profile
            </Link>
            <Link to="/orders" className="hover:text-white">
              My Orders
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            OnlineShop
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Link to="/products" className="hover:text-white">
              Browse Products
            </Link>
            <Link to="/categories" className="hover:text-white">
              Browse Categories
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OnlineShop. All rights reserved.</p>
          <p>Built for a modern shopping experience.</p>
        </div>
      </div>
    </footer>
  );
}