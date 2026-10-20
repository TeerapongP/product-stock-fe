import AddToCartButton from "@/app/components/add-to-cart-button";
import RemainingStock from "@/app/components/remaining-stock";
import type { Product, StockProduct } from "@/app/interface/product";

async function getProducts(): Promise<Product[]> {
  const [productsResponse, stockResponse] = await Promise.all([
    fetch("http://localhost:8080/api/products", { cache: "no-store" }),
    fetch("http://localhost:8080/api/stocks", { cache: "no-store" }),
  ]);

  if (!productsResponse.ok || !stockResponse.ok) {
    throw new Error("โหลดสินค้าไม่สำเร็จ");
  }

  const [products, stockProducts]: [Product[], StockProduct[]] = await Promise.all([
    productsResponse.json(),
    stockResponse.json(),
  ]);
  const stockByProductCode = new Map<string, number>();

  for (const item of stockProducts) {
    const current = stockByProductCode.get(item.productCode) ?? 0;
    stockByProductCode.set(item.productCode, current + item.quantityAvailable);
  }

  return products.map((product) => ({
    ...product,
    stock: stockByProductCode.get(product.productCode) ?? 0,
  }));
}

export default async function ProductList() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">โหลดสินค้าไม่ได้ ตรวจสอบ API ที่ localhost:8080</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3">รหัสสินค้า</th>
            <th scope="col" className="px-4 py-3">สินค้า</th>
            <th scope="col" className="px-4 py-3">รายละเอียด</th>
            <th scope="col" className="px-4 py-3 text-right">ราคา</th>
            <th scope="col" className="px-4 py-3 text-right">คงเหลือ</th>
            <th scope="col" className="px-4 py-3">การทำงาน</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-600">
                {product.productCode}
              </td>
              <th scope="row" className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                {product.productName}
              </th>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                {product.description || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                ฿{product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                <RemainingStock productId={product.productCode} stock={product.stock ?? 0} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <AddToCartButton
                  product={{
                    productId: product.productCode,
                    name: product.productName,
                    price: product.price,
                    stock: product.stock ?? 0,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
