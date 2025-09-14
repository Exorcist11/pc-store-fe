export interface IProduct {
  isActive: boolean;
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  productType: string;
  allowedAttributes: string[];
  variants: Variant[];
  images: string[];
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProductPublic {
  isActive: boolean;
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  productType: string;
  allowedAttributes: string[];
  variants: Variant[];
  images: string[];
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProductResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: IProduct[];
}

export interface Variant {
  _id?: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images: string[];
}

export type ProductType = "laptop" | "desktop" | "accessory";

export interface ICreateProduct {
  name: string;
  description?: string;
  brand: string;
  category: string;
  productType: ProductType;
  allowedAttributes?: string[];
  variants: Variant[];
  images?: string[];
  discount?: number;
  isActive?: boolean;
}
