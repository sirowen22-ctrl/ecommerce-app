"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAt?: number | null;
    images: string;
    stock: number;
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const images = JSON.parse(product.images || "[]");
  const image = images[0] || "https://via.placeholder.com/400";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      slug: product.slug,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.compareAt && product.compareAt > product.price && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-indigo-600 font-medium mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
