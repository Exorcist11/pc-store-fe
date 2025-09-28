// const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL_PATHS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_CURRENT_USER: "/auth/getCurrentUser",
  BRANDS: "/brands",
  CATEGORIES: "/categories",
  PRODUCTS: "/products",
  UPLOAD_IMG: "/cloudinary/image",

  // public
  PUBLIC_PRODUCT: "/public/products",
  PUBLIC_PRODUCT_DETAIL: "/public/product",
  PUBLIC_CATEGORY: "/public/category",
  PUBLIC_PRODUCT_BY_CATEGORY: "/public/productByCategory",

  // cart
  CART: "/carts",

  // order
  ORDERS: "/orders",

  // users
  USERS: "/users",
};

export default URL_PATHS;
