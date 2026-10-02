import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShopHub</h3>
            <p className="text-sm">
              Your one-stop destination for quality products. Fast shipping, secure payments, and excellent support.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white transition">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:text-white transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="hover:text-white transition">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@shophub.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Mon-Fri: 9am - 6pm EST</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
