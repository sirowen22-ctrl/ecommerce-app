import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; featured?: string; search?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const featured = params.featured === "true";
  const search = params.search;
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: any = {};
  if (category) where.category = { slug: category };
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let products: any[] = [];
  let total = 0;
  let categories: any[] = [];

  try {
    [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany(),
    ]);
  } catch (e) {
    console.error(e);
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products"
                className={`block text-sm ${!category ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`block text-sm ${category === cat.slug ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href="/products?featured=true"
              className={`block text-sm ${featured ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
            >
              Featured Only
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {search ? `Search: "${search}"` : featured ? "Featured Products" : category ? categories.find(c => c.slug === category)?.name || "Products" : "All Products"}
            </h1>
            <p className="text-sm text-gray-500">{total} products</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found. Try a different filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/products?page=${p}${category ? `&category=${category}` : ""}${featured ? "&featured=true" : ""}${search ? `&search=${search}` : ""}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    p === page
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
