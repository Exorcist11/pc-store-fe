export interface IUserResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: IUser[];
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
