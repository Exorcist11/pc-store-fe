export type ProductType =
  | "accessory"
  | "component"
  | "laptop"
  | "desktop"
  | "other";

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

export interface ICreateProductPayload {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string;
  productType: ProductType;

  description: string;
  shortDescription?: string;

  specifications?: Record<string, string | number | boolean | null>;

  images?: string[]; // danh sách URL ảnh

  price: number;
  comparePrice?: number;
  costPrice?: number;

  stock?: number;
  minStock?: number;

  weight?: number;

  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };

  compatibility?: {
    sockets?: string[];
    memoryTypes?: string[];
    maxMemory?: number;
  };

  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];

  seoTitle?: string;
  seoDescription?: string;
}
