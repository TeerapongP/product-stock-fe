export interface CartItem {
  productId: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

export type ProductToAdd = Omit<CartItem, "quantity">;

export interface AddToCartButtonProps {
  product: ProductToAdd;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: ProductToAdd) => boolean;
  decreaseItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}
