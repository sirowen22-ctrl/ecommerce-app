import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, reviews: { include: { user: true } } },
    });
  } catch {}

  if (!product) notFound();

  const images = JSON.parse(product.images || "[]");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={images[0] || "https://via.placeholder.com/800"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm text-indigo-600 font-medium"
          >
            {product.category.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">{product.stock} in stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </p>
          </div>

          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: images[0] || "",
                slug: product.slug,
              }}
              disabled={product.stock <= 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
