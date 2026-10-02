import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  let stats = { products: 0, orders: 0, users: 0, revenue: 0 };
  let recentOrders: any[] = [];
  let products: any[] = [];

  try {
    const [productCount, orderCount, userCount, paidOrders, orders, prods] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({ where: { status: "PAID" }, select: { total: true } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: true },
        }),
        prisma.product.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      ]);

    stats = {
      products: productCount,
      orders: orderCount,
      users: userCount,
      revenue: paidOrders.reduce((s, o) => s + o.total, 0),
    };
    recentOrders = orders;
    products = prods;
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map((o) => (
              <div key={o.id} className="px-6 py-3 flex justify-between text-sm">
                <div>
                  <p className="font-medium">#{o.id.slice(-8)}</p>
                  <p className="text-gray-500">{o.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(o.total)}</p>
                  <p className="text-xs text-gray-500">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold">Latest Products</h2>
          </div>
          <div className="divide-y">
            {products.map((p) => (
              <div key={p.id} className="px-6 py-3 flex justify-between text-sm">
                <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                <p className="font-semibold">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Full product CRUD, order management, and user management can be extended from this foundation.
      </p>
    </div>
  );
}
