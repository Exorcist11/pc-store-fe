export interface ICategory {
  _id?: string;
  name: string;
  description: string;
  parent: string;
  slug: string,
  level: number;
  isActive: boolean;
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
