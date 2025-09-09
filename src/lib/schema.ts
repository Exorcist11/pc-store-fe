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
