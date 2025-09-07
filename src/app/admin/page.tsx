"use client";
import { InputWithLabel } from "@/components/CustomInput/InputWithLable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import useAuth from "@/hooks/useAuth";
import { loginFormSchema } from "@/lib/schema";

interface TokenLogin {
  token: string;
}

export default function SignUp() {
  const { signIn } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await axiosInstance({
        method: "POST",
        url: `${URL_PATHS.LOGIN}`,
        data: data,
      });
      if (response) {
        const tokenLogin = {
          token: response?.data.token,
          refreshToken: "",
        };
        signIn(tokenLogin);
      }
    } catch (error) {
      console.error("Error from login", error);
    }
  };
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">Devil May Cry</div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Login
          </h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
            Join to Our Community with all time access and free{" "}
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
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
                        className="p-2 h-10"
                        id="email"
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
                        title="Password"
                        type="password"
                        isRequired
                        className="p-2 h-10"
                        id="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-400 text-white p-2 rounded-md transition-colors duration-300 h-10"
              >
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Already haven't an account?{" "}
              <a href="#" className="text-black hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
