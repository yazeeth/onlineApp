import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">OnlineShop</h1>

          <nav className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">
              Home
            </a>
            <a href="#" className="hover:text-gray-900">
              Products
            </a>
            <a href="#" className="hover:text-gray-900">
              Cart
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-gray-500">
          © OnlineShop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;