"use client";
import { InputWithLabel } from "@/components/CustomInput/InputWithLable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { loginFormSchema } from "@/lib/schema";
import { Monitor, Cpu, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { GetCurrentUser, loginService } from "@/services/account";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface TokenLogin {
  token: string;
}

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, setUser } = useAuthStore();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await loginService(data);

      if (response) {
        const tokenLogin = {
          token: response?.token,
          refreshToken: "",
        };

        localStorage.setItem("token", response?.token);

        const user = await GetCurrentUser();
        setUser(user);

        const redirectPath = user?.role === "admin" ? "/admin/categories" : "/";

        router.push(redirectPath);
        signIn(tokenLogin);
        // const success = await signIn({
        //   token: response?.token,
        //   refreshToken: response?.token || "",
        // });

        // if (success) {
        //   router.push("/");
        // } else {
        //   // Handle login error
        //   console.error("Login failed");
        // }
      }
    } catch (error) {
      console.error("Error from login", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-900 to-purple-800 text-white p-12">
        <div className="flex items-center mb-10">
          <div
            className="flex items-center hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Cpu className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">PC STORE</span>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-grow">
          <h1 className="text-4xl font-bold mb-6">
            Chào mừng đến với PC Store
          </h1>
          <p className="text-lg text-blue-100 mb-10">
            Đăng nhập để khám phá thế giới công nghệ với những sản phẩm chất
            lượng nhất
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <Monitor className="h-6 w-6 mr-3 text-blue-300" />
              <span>PC Gaming</span>
            </div>
            <div className="flex items-center">
              <Cpu className="h-6 w-6 mr-3 text-blue-300" />
              <span>Linh kiện</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-3 text-blue-300" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center">
              <Smartphone className="h-6 w-6 mr-3 text-blue-300" />
              <span>Phụ kiện</span>
            </div>
          </div>
        </div>

        <div className="mt-auto text-sm text-blue-200">
          © 2025 PC Store. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-2 lg:hidden">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 mr-2 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">PC STORE</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Đăng nhập
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Nhập thông tin đăng nhập để tiếp tục
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        placeholder="Nhập mật khẩu"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="ml-2 block text-sm font-medium hover:underline"
                  >
                    Quay trở lại trang chủ
                  </Link>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-300 h-12 font-medium"
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
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm.909 15.542v-5.183h1.543l.231-1.81h-1.774V7.6c0-.524.146-.88.895-.88h.958V5.117c-.165-.022-.73-.07-1.388-.07-1.373 0-2.313.837-2.313 2.375v1.333H7.091v1.81h1.543v5.183h2.275z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.416 15.208c-.384.722-.912 1.219-1.584 1.49-.672.27-1.458.406-2.358.406-.984 0-1.828-.162-2.532-.486-.704-.324-1.246-.768-1.626-1.332-.38-.564-.57-1.188-.57-1.872 0-.432.114-.828.342-1.188.228-.36.558-.648.99-.864.432-.216.942-.372 1.53-.468.588-.096 1.23-.156 1.926-.18l1.674-.054c.12-.024.222-.06.306-.108.084-.048.144-.108.18-.18.036-.072.054-.156.054-.252 0-.216-.066-.396-.198-.54-.132-.144-.324-.234-.576-.27-.252-.036-.546-.054-.882-.054-.576 0-1.074.084-1.494.252-.42.168-.762.402-1.026.702-.264.3-.396.642-.396 1.026H6.1c0-.576.162-1.086.486-1.53.324-.444.78-.792 1.368-1.044.588-.252 1.29-.378 2.106-.378.792 0 1.482.12 2.07.36.588.24 1.044.576 1.368 1.008.324.432.486.912.486 1.44 0 .336-.066.654-.198.954-.132.3-.342.564-.63.792-.288.228-.654.414-1.098.558-.444.144-.966.246-1.566.306-.6.06-1.278.102-2.034.126-.36.024-.654.06-.882.108-.228.048-.408.114-.54.198-.132.084-.222.192-.27.324-.048.132-.072.288-.072.468 0 .264.078.48.234.648.156.168.378.282.666.342.288.06.636.09 1.044.09.576 0 1.062-.078 1.458-.234.396-.156.708-.366.936-.63.228-.264.372-.564.432-.9h-1.872v-1.26h3.384v2.664c0 .072-.006.138-.018.198-.012.06-.024.108-.036.144z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
