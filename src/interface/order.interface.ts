// Guest Info
export interface GuestInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Shipping Address
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  recipientName: string;
  phone: string;
}

// Product Variant
export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // ví dụ { color: "red", size: "M" }
}

// Product
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  type: string;
  variants: ProductVariant[];
  images: string[];
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Item trong Order
export interface OrderItem {
  product: Product;
  variantSku: string;
  quantity: number;
  price: number;
  _id: string;
}

// Order chính
export interface Order {
  _id: string;
  user: string | null; // null nếu là guest
  isGuest: boolean;
  guestInfo?: GuestInfo;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"; // gợi ý enum
  paymentStatus: "unpaid" | "paid";
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "banking" | "paypal";
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface IOrderResponse {
  total: number;
  index: number;
  limit: number;
  totalPages: number;
  items: Order[];
}
