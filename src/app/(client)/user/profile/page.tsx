"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  fullName: z.string().min(2, "Vui lòng nhập họ tên đầy đủ"),
  phone: z
    .string()
    .regex(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ (9–11 số)"),
});

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Submit:", values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg uppercase font-semibold">Thông tin cá nhân</h3>
      </div>

      <Form {...form}>
        <form
          id="profileForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-2"
        >
          {/* Full name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập họ và tên"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: 0901234567"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Để trống nếu bạn không muốn thay đổi mật khẩu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex justify-end">
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="submit" form="profileForm">
              Lưu thay đổi
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy bỏ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
