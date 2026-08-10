import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: () =>
      userApi.register({
        name,
        email,
        phone,
        password,
      }),
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden rounded-3xl border bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-gray-950">
                O
              </div>
              <span className="text-xl font-bold tracking-tight">OnlineShop</span>
            </div>

            <div className="mt-20 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Join OnlineShop
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">
                Your shopping experience starts here.
              </h2>
              <p className="mt-6 text-base leading-7 text-gray-300">
                Create your account to discover products, manage your cart, and
                keep your orders organized in one place.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Secure account creation · Simple shopping · Easy order tracking
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-lg font-black text-white">
                  O
                </div>
                <span className="text-xl font-bold tracking-tight">OnlineShop</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                Create account
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                Welcome to OnlineShop
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your details below to create your customer account.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                  Phone number <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  required
                />
                <p className="mt-2 text-xs text-gray-400">
                  Use a password you do not reuse on other websites.
                </p>
              </div>
            </div>

            {registerMutation.error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                Registration failed. Please check your details and try again.
              </div>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="mt-7 w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-gray-950 underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}