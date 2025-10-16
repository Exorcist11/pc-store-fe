"use client";
import { InputWithLabel } from "@/components/CustomInput/InputWithLable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import { Monitor, Cpu, Shield, Smartphone, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Schema validation cho đăng ký
const registerFormSchema = z
  .object({
    username: z.string().min(2, "Tên đăng nhập phải có ít nhất 2 ký tự"),
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số"),
    confirmPassword: z.string(),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản và chính sách",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance({
        method: "POST",
        url: `${URL_PATHS.REGISTER}`,
        data: {
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone,
        },
      });

      if (response) {
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error("Error from registration", error);
      // Xử lý lỗi ở đây (hiển thị thông báo lỗi cho người dùng)
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-900 to-purple-800 text-white p-12">
          <div className="flex items-center mb-10">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">PC STORE</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Đăng ký thành công!
            </h1>
            <p className="text-gray-600 mb-6">
              Chúc mừng bạn đã đăng ký tài khoản tại PC Store thành công. Vui
              lòng kiểm tra email để xác thực tài khoản.
            </p>

            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg h-12 font-medium"
            >
              <Link href="/login">Đăng nhập ngay</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-900 to-purple-800 text-white p-12">
        <div className="flex items-center mb-10">
          <div className="flex items-center">
            <Cpu className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">PC STORE</span>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-grow">
          <h1 className="text-4xl font-bold mb-6">
            Tham gia cộng đồng PC Store
          </h1>
          <p className="text-lg text-blue-100 mb-10">
            Đăng ký ngay để nhận ưu đãi đặc biệt và cập nhật công nghệ mới nhất
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <Check className="h-4 w-4" />
              </div>
              <span>Nhận thông báo khuyến mãi độc quyền</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <Check className="h-4 w-4" />
              </div>
              <span>Theo dõi đơn hàng dễ dàng</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <Check className="h-4 w-4" />
              </div>
              <span>Lưu trữ lịch sử mua hàng</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <Check className="h-4 w-4" />
              </div>
              <span>Tích lũy điểm thưởng và ưu đãi VIP</span>
            </div>
          </div>
        </div>

        <div className="mt-auto text-sm text-blue-200">
          © 2025 PC Store. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-2 lg:hidden">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 mr-2 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">PC STORE</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Tạo tài khoản để trải nghiệm mua sắm tốt nhất
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Tên đăng nhập"
                        type="text"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="username"
                        placeholder="Nhập tên đăng nhập"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.username && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.username.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Họ và tên"
                        type="text"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="fullName"
                        placeholder="Nhập họ và tên đầy đủ"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.fullName && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.fullName.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Email"
                        type="email"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="email"
                        placeholder="Nhập địa chỉ email"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.email && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Số điện thoại"
                        type="tel"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.phone && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.phone.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Mật khẩu"
                        type="password"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="password"
                        placeholder="Tạo mật khẩu mạnh"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.password && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.password.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        title="Xác nhận mật khẩu"
                        type="password"
                        isRequired
                        className="p-3 h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.confirmPassword && (
                      <span className="text-red-500 text-sm">
                        {form.formState.errors.confirmPassword.message}
                      </span>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <label className="text-sm text-gray-600">
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Chính sách bảo mật
                        </a>{" "}
                        của PC Store
                      </label>
                      {form.formState.errors.agreeToTerms && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.agreeToTerms.message}
                        </p>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-300 h-12 font-medium mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng ký tài khoản"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
