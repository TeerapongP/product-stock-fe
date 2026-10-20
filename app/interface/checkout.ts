export interface CheckoutItemRequest {
  productCode: string;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
}

export interface CheckoutResponse {
  message: string;
  amountDue: number;
  items: Array<{
    productCode: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface CheckoutErrorResponse {
  message?: string;
  productCode?: string;
  available?: number;
  requested?: number;
}
