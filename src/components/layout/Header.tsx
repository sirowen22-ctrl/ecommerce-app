"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Search, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

export default function Header() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            action="/products"
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
            >
              Shop
            </Link>
            <Link
              href="/products?featured=true"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
            >
              Featured
            </Link>

            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}

            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-indigo-600" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">{session.user.name || "Account"}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t bg-white",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="px-4 py-3 space-y-3">
          <form action="/products">
            <input
              type="search"
              name="search"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </form>
          <Link
            href="/products"
            className="block py-2 text-gray-700"
            onClick={() => setMobileOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 py-2 text-gray-700"
            onClick={() => setMobileOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            Cart ({totalItems()})
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="block py-2 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="block py-2 text-indigo-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="block py-2 text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="block py-2 text-indigo-600 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
