import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";
import { getUserById } from "@/services/users";

const userSchema = z.object({
  username: z.string().min(1, "Username là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .optional()
    .or(z.literal("")),
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  role: z.enum(["admin", "staff", "customer"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSubmit: (data: UserFormValues) => Promise<void>;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export default function EditUserModal({
  open,
  onOpenChange,
  user,
  onSubmit,
  mode,
  isLoading = false,
}: EditUserModalProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      mode === "create"
        ? userSchema.refine(
            (data) => data.password && data.password.length >= 6,
            {
              message: "Mật khẩu là bắt buộc khi tạo mới",
              path: ["password"],
            }
          )
        : userSchema
    ),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      phone: "",
      role: "customer",
    },
  });

  const getDetailUser = async () => {
    try {
      if (open) {
        if (mode === "edit" && user) {
          const res = await getUserById(user._id);

          form.reset({
            username: res?.username || "",
            email: res?.email || "",
            password: "",
            fullName: res?.fullName || "",
            phone: res?.phone || "",
            role: res?.role || "customer",
          });
        } else if (mode === "create") {
          form.reset({
            username: "",
            email: "",
            password: "",
            fullName: "",
            phone: "",
            role: "customer",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  useEffect(() => {
    getDetailUser();
  }, [user, form, open, mode]);

  const handleSubmit = async (data: UserFormValues) => {
    // Nếu đang edit và password trống thì remove password khỏi data
    if (mode === "edit" && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      await onSubmit(dataWithoutPassword as UserFormValues);
    } else {
      await onSubmit(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Thêm mới tài khoản"
              : "Chỉnh sửa thông tin tài khoản"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Nhập thông tin để tạo tài khoản mới."
              : "Cập nhật thông tin người dùng. Nhấn lưu để hoàn tất."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập username"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Nhập email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {mode === "create"
                      ? "Password *"
                      : "Password (để trống nếu không đổi)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        mode === "create"
                          ? "Nhập mật khẩu"
                          : "Nhập mật khẩu mới"
                      }
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ tên"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Đang xử lý..."
                  : mode === "create"
                  ? "Tạo mới"
                  : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
