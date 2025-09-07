export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IBrandResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: IBrand[]
}
