"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore, CartProduct } from "@/store/cart";

interface Props {
  product: CartProduct;
  disabled?: boolean;
}

export default function AddToCartButton({ product, disabled }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center border rounded-full overflow-hidden">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-4 py-3 text-gray-600 hover:bg-gray-50"
        >
          -
        </button>
        <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className="px-4 py-3 text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
