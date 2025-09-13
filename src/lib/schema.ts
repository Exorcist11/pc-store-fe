import { ERROR_MESSAGE } from "@/constants/error-message";
import { fileSchema } from "@/services/file/file";
import { string, z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .min(1, "Mật khẩu là bắt buộc"),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
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
