export interface IAddToCart {
  user: string;
  items: IAddCartItem[];
}

export interface IAddCartItem {
  product: string;
  variantSku: string;
  quantity: number;
  priceAtAdd: number;
}
