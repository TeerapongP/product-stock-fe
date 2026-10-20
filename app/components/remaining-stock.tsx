"use client";

import { useCartStore } from "@/app/stores/cart-store";

interface RemainingStockProps {
  productId: string;
  stock: number;
}

export default function RemainingStock({ productId, stock }: RemainingStockProps) {
  const quantityInCart = useCartStore(
    (state) => state.items.find((item) => item.productId === productId)?.quantity ?? 0
  );

  return <>{Math.max(0, stock - quantityInCart)}</>;
}
