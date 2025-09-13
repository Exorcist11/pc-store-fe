export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  categoryId?: string;
  brandId?: string;
  productType?: ProductType;
  description?: string;
  shortDescription?: string;

  specifications?: Record<string, string | number | boolean | null>;

  images?: string[];
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;

  stock?: number;
  minStock?: number;

  weight?: number;

  dimensions?: IDimensions;

  compatibility?: ICompatibility;

  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];

  seoTitle?: string;
  seoDescription?: string;

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface ICompatibility {
  sockets: string[];
  memoryTypes: string[];
}

export interface IProductResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: IProduct[];
}

export interface Variant {
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
