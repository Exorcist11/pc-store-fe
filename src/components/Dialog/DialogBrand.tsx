import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { IDialogProps } from "@/interface/shared/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema } from "@/lib/schema";
import { dialogTitle } from "@/utils/dialogTitle";
import { ACTION, PAGE } from "@/constants/action";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import toastifyUtils from "@/utils/toastify";
import { errorFunc } from "@/lib/errorFunc";
import { InputWithLabel } from "../CustomInput/InputWithLable";
import { Switch } from "../ui/switch";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { uploadFile } from "@/services/file/file";
import { createNewBrand, getBrandById, updateBrand } from "@/services/brand";
import { IBrand } from "@/interface/brands.interface";

export default function DialogBrand(props: IDialogProps) {
  const { open, setOpen, type, id, reload, setType } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined,
      description: "",
      isActive: true,
    },
  });

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const imgUrl = await uploadFile(formData);
      return imgUrl;
    } catch (error) {
      toastifyUtils("error", "Tải lên hình ảnh thất bại!");
      throw error;
    }
  };

  const handleGetBrandById = async () => {
    try {
      const response = await getBrandById(id);
      if (response) {
        form.reset({
          name: response.name,
          slug: response.slug,
          logo: response.logo,
          description: response.description,
          isActive: response.isActive,
        });
      }
    } catch (error) {
      console.error("Error fetching brand: ", error);
    }
  };

  const onDelete = async () => {
    try {
      if (type === ACTION.DELETE) {
        // TODO: call delete API
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      reload && reload(1);
      setOpen(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof brandSchema>) => {
    try {
      setIsLoading(true);

      if (data.logo instanceof File) {
        const logoUrl = await handleUploadImage(data.logo);
        form.setValue("logo", logoUrl);
      }

      const payload = form.getValues();
      const dataSend: IBrand = {
        name: payload.name,
        logo: String(payload?.logo),
        slug: payload.slug,
        description: String(payload.description),
        isActive: payload.isActive,
      };

      if (!id) {
        createNewBrand(dataSend);
        toastifyUtils("success", "Thêm mới thương hiệu thành công!");
      } else {
        updateBrand(id, dataSend);
        toastifyUtils("success", "Cập nhật thương hiệu thành công!");
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
    if (id) {
      handleGetBrandById();
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen && setOpen(!open)}>
      <DialogContent className="sm:max-w-[800px] max-h-[700px] flex flex-col">
        <Form {...form}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{dialogTitle(type, PAGE.BRAND)}</DialogTitle>
          </DialogHeader>

          {type === ACTION.DELETE ? (
            <>
              <div className="flex-1 overflow-auto py-4">
                <h3>
                  Bạn có xác nhận xóa thương hiệu trên. Dữ liệu xóa không thể
                  khôi phục!
                </h3>
              </div>
              {/* Footer cố định */}
              <DialogFooter className="flex-shrink-0 border-t pt-4">
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
              {/* Nội dung cuộn được */}
              <div className="flex-1 overflow-auto hide-scrollbar py-4">
                {isLoading ? (
                  <div className="flex flex-col gap-5">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <form
                    onSubmit={form.handleSubmit(onSubmit, errorFunc)}
                    className="flex flex-col gap-5"
                  >
                    {/* Logo */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => {
                          const value = field.value;
                          const valueArray = value ? [value] : [];
                          return (
                            <FormItem>
                              <FormLabel className="font-bold">Logo</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  value={valueArray}
                                  onChange={(files) => field.onChange(files[0])}
                                  multiple={false}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    {/* Name + Slug */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className={id ? "" : "col-span-2"}>
                            <FormControl>
                              <InputWithLabel
                                {...field}
                                placeholder="Tên thương hiệu"
                                title="Tên thương hiệu"
                                type="text"
                                disable={type === ACTION.VIEW || isLoading}
                                isRequired
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {(id || type === ACTION.EDIT || type === ACTION.VIEW) && (
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <InputWithLabel
                                  {...field}
                                  placeholder="Slug"
                                  title="Slug"
                                  type="text"
                                  disable={type === ACTION.VIEW || isLoading}
                                  isRequired
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              placeholder="Mô tả"
                              title="Mô tả"
                              type="text"
                              as="textarea"
                              disable={type === ACTION.VIEW || isLoading}
                              isRequired
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="w-full flex-col flex">
                          <FormLabel className="font-bold">
                            Trạng thái
                          </FormLabel>
                          <Switch
                            disabled={type === ACTION.VIEW}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                        </FormItem>
                      )}
                    />
                  </form>
                )}
              </div>

              {/* Footer cố định */}
              <DialogFooter className="flex-shrink-0 border-t pt-4">
                <div className="flex gap-2 items-center justify-end w-full">
                  <Button
                    type="reset"
                    variant={"outline"}
                    disabled={isLoading}
                    onClick={() => setOpen(false)}
                    className="min-w-[120px]"
                  >
                    Hủy bỏ
                  </Button>
                  {type === ACTION.VIEW && (
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setType(ACTION.EDIT)}
                      className="min-w-[120px]"
                    >
                      Chỉnh sửa
                    </Button>
                  )}

                  {type !== ACTION.VIEW && (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? "Loading..." : "Lưu"}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
