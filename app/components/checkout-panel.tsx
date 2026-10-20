"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/cart-store";
import type {
  CheckoutErrorResponse,
  CheckoutRequest,
  CheckoutResponse,
} from "@/app/interface/checkout";

export default function CheckoutPanel() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [receipt, setReceipt] = useState<CheckoutResponse | null>(null);

  async function handleCheckout() {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setReceipt(null);

    const requestBody: CheckoutRequest = {
      items: items.map((item) => ({
        productCode: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const result: CheckoutResponse | CheckoutErrorResponse = await response.json();

      if (!response.ok || !("amountDue" in result)) {
        setErrorMessage(result.message ?? "ชำระเงินไม่สำเร็จ");
        return;
      }
      setReceipt(result);
      clearCart();
      router.refresh();
    } catch {
      setErrorMessage("เชื่อมต่อระบบชำระเงินไม่ได้ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">ตะกร้าสินค้า</h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            ล้างสินค้าทั้งหมด
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">สินค้า</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">ราคา</th>
                <th scope="col" className="px-4 py-2 text-center font-medium">จำนวน</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">รวม</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.productId}>
                  <th scope="row" className="px-4 py-3 font-medium text-slate-900">
                    {item.name}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                    ฿{item.price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label={`ลดจำนวน ${item.name}`}
                        onClick={() => decreaseItem(item.productId)}
                        className="size-8 rounded border border-slate-300 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`เพิ่มจำนวน ${item.name}`}
                        onClick={() => addItem({
                          productId: item.productId,
                          name: item.name,
                          price: item.price,
                          stock: item.stock,
                        })}
                        disabled={item.quantity >= item.stock}
                        className="size-8 rounded border border-slate-300 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                    ฿{(item.price * item.quantity).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="rounded px-2 py-1 text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t bg-slate-50">
              <tr>
                <th scope="row" colSpan={3} className="px-4 py-3 text-right font-semibold text-slate-900">
                  ยอดรวม
                </th>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                  ฿{cartTotal.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0 || isSubmitting}
        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "กำลังตรวจสอบ..." : "ชำระเงิน"}
      </button>

      {errorMessage && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      {receipt && (
        <div role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">
            ยอดที่ต้องชำระ ฿
            {receipt.amountDue.toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-1 text-emerald-800">ตัดสต็อกเรียบร้อย</p>
        </div>
      )}
    </section>
  );
}
