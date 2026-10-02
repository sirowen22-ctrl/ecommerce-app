import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. You will receive a confirmation email shortly.
        You can track your order in your dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/orders"
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
