export interface IApiParams {
  keyword?: string;
  index?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export interface IApiOrderByUserParams {
  userId: string;
  keyword?: string;
  index?: number;
  limit?: number;
  order?: "asc" | "desc";
  sort?: string;
}
