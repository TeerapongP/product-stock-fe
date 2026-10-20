import { Suspense } from "react";
import CartCountClient from "@/app/components/cart-count";
import CheckoutPanel from "@/app/components/checkout-panel";
import ProductList from "@/app/components/product-list";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 text-slate-900 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">สินค้าทั้งหมด</h1>
        <CartCountClient />
      </header>
      <CheckoutPanel />
      <Suspense fallback={<p className="text-white">กำลังโหลดสินค้า...</p>}>
        <ProductList />
      </Suspense>
    </main>
  );
}
