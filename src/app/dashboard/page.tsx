import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {session.user.name || "User"}!
      </h1>
      <p className="text-gray-600 mb-8">Manage your account and view recent orders.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="text-3xl font-bold mt-1 capitalize">{session.user.role.toLowerCase()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium mt-1 truncate">{session.user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link href="/orders" className="text-indigo-600 text-sm hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No orders yet.{" "}
            <Link href="/products" className="text-indigo-600 hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
