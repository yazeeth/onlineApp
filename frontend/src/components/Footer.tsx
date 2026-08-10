import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="text-2xl font-black tracking-tight text-white transition hover:text-blue-100">
            OnlineShop
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            A simple and reliable online shopping experience for discovering
            products, managing your cart, and tracking your orders.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-100">
            Shop
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/products" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Products
            </Link>
            <Link to="/categories" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Categories
            </Link>
            <Link to="/cart" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Shopping Cart
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-100">
            Account
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/login" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Login
            </Link>
            <Link to="/register" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Register
            </Link>
            <Link to="/profile" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              My Profile
            </Link>
            <Link to="/orders" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              My Orders
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-100">
            OnlineShop
          </h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Home
            </Link>
            <Link to="/products" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Browse Products
            </Link>
            <Link to="/categories" className="text-slate-400 transition hover:text-white hover:underline hover:underline-offset-4">
              Browse Categories
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OnlineShop. All rights reserved.</p>
          <p>Built for a modern shopping experience.</p>
        </div>
      </div>
    </footer>
  );
}