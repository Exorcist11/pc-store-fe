export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  level: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IBrandResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: ICategory[];
}
