import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginLoading, loginError, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(
      {
        email: email.trim(),
        password,
      },
      {
        onSuccess: (maybeUser?: any) => {
          // If the login callback provides the user, use it; otherwise, use auth state.
          const redirectUser = maybeUser || user;
          if (redirectUser?.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-brand-700 shadow-sm">
                OS
              </div>
              <span className="text-xl font-bold tracking-tight">OnlineShop</span>
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-brand-100">
              Welcome back
            </p>
            <h2 className="max-w-md text-4xl font-black leading-tight tracking-tight xl:text-5xl">
              Everything you need, in one place.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-indigo-100">
              Sign in to manage your account, browse products, track orders,
              and continue shopping.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Secure access to your OnlineShop account.
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-black text-white shadow-sm">
                  OS
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-950">
                  OnlineShop
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Sign in
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Enter your credentials to continue to your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-xs font-semibold text-brand-600 transition hover:text-brand-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-danger-500 shadow-sm"
                >
                  We couldn't sign you in. Please check your email and password
                  and try again.
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 transition hover:text-brand-700"
              >
                ← Back to store
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}