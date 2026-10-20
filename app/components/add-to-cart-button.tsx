"use client";

import { useState } from "react";
import { useCartStore } from "@/app/stores/cart-store";
import type { AddToCartButtonProps } from "@/app/interface/cart";

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const [message, setMessage] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const quantityInCart = useCartStore(
    (state) =>
      state.items.find((item) => item.productId === product.productId)?.quantity ?? 0
  );
  const isOutOfStock = quantityInCart >= product.stock;
  const shouldShowMessage =
    message !== "เพิ่มลงตะกร้าแล้ว" ||
    (quantityInCart > 0 && quantityInCart < product.stock);

  return (
    <div>
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={() => {
          const added = addItem(product);
          setMessage(added ? "เพิ่มลงตะกร้าแล้ว" : "สต็อกสินค้าไม่เพียงพอ");
        }}
        className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {product.stock === 0
          ? "สินค้าหมด"
          : isOutOfStock
            ? "ครบจำนวนสต็อก"
            : "เพิ่มลงตะกร้า"}
      </button>
      {message && shouldShowMessage && <p role="status">{message}</p>}
    </div>
  );
}
