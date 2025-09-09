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
import { brandSchema, categorySchema } from "@/lib/schema";
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
import { ICategory } from "@/interface/category.interface";
import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "@/services/categories";
import ReactSelect from "../CustomSelect/ReactSelect";
import { IApiParams } from "@/interface/shared/api";

export default function DialogCategory(props: IDialogProps) {
  const { open, setOpen, type, id, reload, setType } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [CATEGORIES, setCATEGORIES] = React.useState<
    { value: string; label: string }[]
  >([]);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      level: 0,
      isActive: true,
      sortOrder: 1,
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
      const response: ICategory = await getCategoryById(id);
      if (response) {
        form.reset({
          name: response.name,
          slug: response.slug,
          description: response.description,
          parentId: response.parentId,
          level: response.level,
          isActive: response.isActive,
          sortOrder: response.sortOrder,
        });
      }
    } catch (error) {
      console.error("Error fetching brand: ", error);
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

      const payload = form.getValues();
      const dataSend: ICategory = {
        name: payload.name,
        slug: payload.slug,
        description: String(payload.description),
        parentId: String(payload.parentId),
        level: payload.level,
        isActive: payload.isActive,
        sortOrder: payload.sortOrder ?? 0,
      };

      console.log(dataSend);

      if (!id) {
        createNewCategory(dataSend);
        toastifyUtils("success", "Thêm mới danh mục thành công!");
      } else {
        updateCategory(id, dataSend);
        toastifyUtils("success", "Cập nhật danh mục thành công!");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      reload && reload(1);
      setOpen(false);
    }
  };

  const handleGetListCategory = async () => {
    const params: IApiParams = {
      limit: 100,
      index: 1,
      order: "createdDate",
      sort: "asc",
    };
    try {
      const response = await getAllCategories(params);
      setCATEGORIES(
        response.data.items.map((item: ICategory) => ({
          value: item._id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching brands: ", error);
    }
  };

  React.useEffect(() => {
    handleGetListCategory();
    if (id) {
      handleGetBrandById();
    }
  }, [id]);
  return (
    <Dialog open={open} onOpenChange={() => setOpen && setOpen(!open)}>
      <DialogContent className="sm:max-w-[800px] max-h-[700px] overflow-auto hide-scrollbar">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>{dialogTitle(type, PAGE.CATEGORY)}</DialogTitle>
          </DialogHeader>
          {type === ACTION.DELETE ? (
            <>
              <h3>
                Bạn có xác nhận xóa thương hiệu trên. Dữ liệu xóa không thể khôi
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
                  <div className=" grid grid-cols-2 gap-4"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              placeholder="Tên thể loại"
                              title="Tên thể loại"
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
                    name="name"
                    render={({ field }) => (
                      <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <ReactSelect
                                options={CATEGORIES}
                                value={CATEGORIES.find(
                                  (option) => option.value === field.value
                                )}
                                onChange={(selectedOption) => {
                                  field.onChange(selectedOption?.value);
                                }}
                                label="Parent"
                                placeholder="Parent"
                                disabled={type === ACTION.VIEW}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            {...field}
                            placeholder="Level"
                            title="Level"
                            type="number"
                            disable={type === ACTION.VIEW || isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
