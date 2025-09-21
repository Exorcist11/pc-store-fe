import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .min(1, "Mật khẩu là bắt buộc"),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  logo: z.union([z.instanceof(File), z.string().url().nullable()]).optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string().optional(),
  parent: z.string().optional(),
  level: z.number(),
  isActive: z.boolean(),
});

// Zod schema based on your Mongoose schema
const variantSchema = z.object({
  sku: z.string().min(1, "SKU là bắt buộc"),
  slug: z.string().optional(),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  stock: z.number().min(0, "Số lượng tồn kho phải >= 0").default(0),
  attributes: z.record(z.string(), z.string()),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).default([]),
});

export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  slug: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().min(1, "Thương hiệu là bắt buộc"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  productType: z.enum(["laptop", "desktop", "accessory"], {
    required_error: "Loại sản phẩm là bắt buộc",
  }),
  allowedAttributes: z.array(z.string()).default([]),
  variants: z.array(variantSchema).min(1, "Ít nhất 1 biến thể là bắt buộc"),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).default([]),
  discount: z.number().min(0).max(100).default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const shippingAddressSchema = z.object({
  stress: z.string().min(1, "Địa chỉ là bắt buộc"),
  city: z.string().min(1, "Tỉnh là bắt buộc"),
  state: z.string().min(1, "Phường/Xã là bắt buộc"),
  country: z.string().optional(),
  phone: z.string().optional(),
  recipientName: z.string().optional()
});

export const guestInfoSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc"),
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
});

export const itemProductSchema = z.object({
  productId: z.string().min(1, "Mã sản phẩm là bắt buộc"),
  variantSku: z.string().min(1, "Mã varient là bắt buộc"),
  quantity: z.string().min(1, "Số lượng sản phẩm là bắt buộc"),
  name: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  discountPercent: z.number().optional(),
});

export const paymentSchema = z.object({
  userId: z.string().optional(),
  isGuest: z.boolean().optional(),
  guestInfo: guestInfoSchema,
  items: z.array(itemProductSchema).min(1, "Thanh toán tối thiểu 1 sản phẩm"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
