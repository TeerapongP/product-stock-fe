export interface Product {
  id: number;
  productCode: string;
  productName: string;
  description: string | null;
  price: number;
  isActive: boolean;
  stock?: number;
}

export interface StockProduct {
  productCode: string;
  quantityAvailable: number;
}
