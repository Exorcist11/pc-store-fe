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
import { createNewBrand } from "@/services/brand";
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

  const onDelete = async () => {
    try {
      if (type === ACTION.DELETE) {
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
      console.log(payload);
      if (type === ACTION.ADD) {
        createNewBrand(dataSend);
        toastifyUtils("success", "Thêm mới thương hiệu thành công!");
      }

      if (type === ACTION.EDIT) {
        toastifyUtils("success", "Cập nhật xe thành công!");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      reload && reload(1);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen && setOpen(!open)}>
      <DialogContent className="sm:max-w-[800px] max-h-[700px] overflow-auto hide-scrollbar">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>{dialogTitle(type, PAGE.BRAND)}</DialogTitle>
          </DialogHeader>
          {type === ACTION.DELETE ? (
            <>
              <h3>
                Bạn có xác nhận xóa người dùng trên. Dữ liệu xóa không thể khôi
                phục!
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
                    name="logo"
                    render={({ field }) => {
                      const file =
                        field.value instanceof File ? field.value : undefined;
                      return (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={file ? [file] : []}
                              onChange={(files) => field.onChange(files[0])}
                              multiple={false}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
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
                  </div>

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

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="w-full flex-col flex">
                        <FormLabel className="font-bold">Trạng thái</FormLabel>
                        <Switch
                          disabled={type === ACTION.VIEW}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
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
                </form>
              )}
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
