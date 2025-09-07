"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { InputWithLabel } from "../CustomInput/InputWithLable";
import Select from "react-select";
import { ROLES } from "@/lib/role";
import { errorFunc } from "@/lib/errorFunc";
import {
  addNewUser,
  deleteUser,
  getUserById,
  updateUser,
} from "@/services/users";
import { Skeleton } from "../ui/skeleton";
import { ACTION, PAGE } from "@/constants/action";
import { dialogTitle } from "@/utils/dialogTitle";
import { IDialogProps } from "@/interface/dialog.interface";

export default function UserActionDialog(props: IDialogProps) {
  const { open, setOpen, type, id, reload, setType } = props;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      phoneNumber: 0,
      role: "",
    },
  });

  const getDetailUser = async () => {
    setIsLoading(true);
    try {
      const response = await getUserById(id);
      const defaultFormValue = {
        fullName: response?.fullName,
        email: response?.email,
        phoneNumber: response?.phoneNumber,
        role: response.role,
      };
      form.reset(defaultFormValue);
    } catch (error) {
      console.error("Error from get detail user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      setIsLoading(true);
      if (type === ACTION.ADD) {
        await addNewUser({
          ...data,
          fullName: data.fullName || "",
          password: data.password || "",
          phoneNumber: data.phoneNumber.toString(),
        });
      }

      if (type === ACTION.EDIT) {
        await updateUser(
          {
            ...data,
            fullName: data.fullName || "",
            password: data.password || "",
            phoneNumber: data.phoneNumber.toString(),
          },
          id
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      reload && reload(1);
      setOpen(false);
    }
  };

  const onDelete = async () => {
    try {
      if (type === ACTION.DELETE) {
        await deleteUser(id);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      reload && reload(1);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (type !== ACTION.ADD) {
      getDetailUser();
    }
  }, [id]);

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen && setOpen(!open)}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...form}>
            <DialogHeader>
              <DialogTitle>{dialogTitle(type, PAGE.USER)}</DialogTitle>
            </DialogHeader>
            {type === ACTION.DELETE ? (
              <>
                <h3>
                  Bạn có xác nhận xóa người dùng trên. Dữ liệu xóa không thể
                  khôi phục!
                </h3>

                <DialogFooter className="w-full flex flex-row sm:justify-between">
                  <div className="flex gap-2 items-center justify-end w-full">
                    <Button
                      type="reset"
                      variant={"outline"}
                      disabled={isLoading}
                      onClick={() => setOpen(false)}
                    >
                      Hủy bỏ
                    </Button>

                    <Button
                      type="button"
                      variant={"destructive"}
                      disabled={isLoading}
                      onClick={onDelete}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </DialogFooter>
              </>
            ) : (
              <>
                {isLoading ? (
                  <div className="flex flex-col gap-5 py-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <form
                    onSubmit={form.handleSubmit(onSubmit, errorFunc)}
                    className="flex flex-col gap-5 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              placeholder="Họ và tên"
                              title="Họ tên"
                              type="text"
                              disable={type === ACTION.VIEW || isLoading}
                            />
                          </FormControl>
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
                              {...field}
                              placeholder="Email"
                              title="Email"
                              type="email"
                              disable={type !== ACTION.ADD || isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              value={field.value.toString()}
                              placeholder="Số điện thoại"
                              title="Số điện thoại"
                              type="number"
                              disable={type === ACTION.VIEW || isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {type === ACTION.ADD && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <InputWithLabel
                                {...field}
                                placeholder="Mật khẩu"
                                title="Mật khẩu"
                                type="password"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            Loại tài khoản
                          </FormLabel>
                          <FormControl>
                            <Select
                              className="text-sm"
                              options={ROLES}
                              getOptionLabel={(e) => e.title}
                              getOptionValue={(e) => e.value}
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value)
                              }
                              value={
                                ROLES.find(
                                  (role) => role.value === field.value
                                ) || null
                              }
                              placeholder="Chọn loại tài khoản"
                              isDisabled={type === ACTION.VIEW || isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="w-full flex flex-row sm:justify-between">
                      <div className="flex gap-2 items-center justify-end w-full">
                        <Button
                          type="reset"
                          variant={"outline"}
                          disabled={isLoading}
                          onClick={() => setOpen(false)}
                        >
                          Hủy bỏ
                        </Button>
                        {type === ACTION.VIEW && (
                          <Button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setType(ACTION.EDIT)}
                          >
                            Chỉnh sửa
                          </Button>
                        )}

                        {type !== ACTION.VIEW && (
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Lưu"}
                          </Button>
                        )}
                      </div>
                    </DialogFooter>
                  </form>
                )}
              </>
            )}
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
