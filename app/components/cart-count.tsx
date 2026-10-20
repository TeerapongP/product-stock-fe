"use client";

import { useCartStore } from "@/app/stores/cart-store";

export default function CartCountClient() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <div className="relative size-32 ...">
      <div className="absolute top-0 right-0 flex w-max items-center gap-2 whitespace-nowrap text-white">
        ตะกร้า <span className="font-bold text-emerald-700">{count}</span> ชิ้น
      </div>
    </div>
  );
}
