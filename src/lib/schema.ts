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
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  level: z.number(),
  isActive: z.boolean(),
  sortOrder: z.number().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  productType: z.string().min(1, "Product type is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  price: z.number().min(0, "Price must be positive"),
  comparePrice: z.number().min(0, "Compare price must be positive"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  stock: z.number().min(0, "Stock must be positive"),
  minStock: z.number().min(0, "Minimum stock must be positive"),
  weight: z.number().min(0, "Weight must be positive"),
  dimensions: z.object({
    length: z.number().min(0, "Length must be positive"),
    width: z.number().min(0, "Width must be positive"),
    height: z.number().min(0, "Height must be positive"),
  }),
  compatibility: z.object({
    sockets: z.array(z.string()).min(1, "At least one socket is required"),
    memoryTypes: z
      .array(z.string())
      .min(1, "At least one memory type is required"),
    maxMemory: z.number().min(0, "Max memory must be positive"),
  }),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).optional(),
  seoTitle: z.string().min(1, "SEO title is required"),
  seoDescription: z.string().min(1, "SEO description is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
