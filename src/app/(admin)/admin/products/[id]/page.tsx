"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { X, Plus } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { ProductFormData, productSchema } from "@/lib/schema";
import { ISelectOption } from "@/interface/shared/common";
import { IApiParams } from "@/interface/shared/api";
import { getAllBrands } from "@/services/brand";
import { IBrand } from "@/interface/brands.interface";
import { getAllCategories } from "@/services/categories";
import { ICategory } from "@/interface/category.interface";
import { ATTRIBUTE_OPTIONS, PRODUCT_TYPES } from "@/constants/productAttribute";
import { slugify } from "@/utils/slugifyCustom";
import { useParams, useRouter } from "next/navigation";
import VariantItem from "@/components/VarientItem/VariantItem";
import { errorFunc } from "@/lib/errorFunc";
import { uploadFile } from "@/services/file/file";
import toastifyUtils from "@/utils/toastify";
import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import {
  createNewProduct,
  getProductById,
  updateProduct,
} from "@/services/products";

export default function ProductForm() {
  const [attributeInput, setAttributeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [BRANDS, setBRANDS] = useState<ISelectOption[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<ISelectOption[]>([]);

  const params = useParams();
  const router = useRouter();
  const isCreateProduct = params.id === "new";

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      brand: "",
      category: "",
      productType: undefined,
      allowedAttributes: [],
      variants: [
        {
          sku: "",
          slug: "",
          price: 0,
          stock: 0,
          attributes: {},
          images: [],
        },
      ],
      images: [],
      discount: 0,
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // Auto generate slug from product name
  const name = form.watch("name");
  useEffect(() => {
    if (name) {
      const newSlug = slugify(name);
      form.setValue("slug", newSlug);
    }
  }, [name, form]);

  const addAllowedAttribute = () => {
    if (
      attributeInput &&
      !form.getValues("allowedAttributes").includes(attributeInput)
    ) {
      form.setValue("allowedAttributes", [
        ...form.getValues("allowedAttributes"),
        attributeInput,
      ]);
      setAttributeInput("");
    }
  };

  const addCustomAttribute = () => {
    if (
      newAttributeName &&
      !form.getValues("allowedAttributes").includes(newAttributeName)
    ) {
      form.setValue("allowedAttributes", [
        ...form.getValues("allowedAttributes"),
        newAttributeName,
      ]);
      setNewAttributeName("");
    }
  };

  const removeAllowedAttribute = (index: number) => {
    const updated = [...form.getValues("allowedAttributes")];
    updated.splice(index, 1);
    form.setValue("allowedAttributes", updated);
  };

  const addVariantAttribute = (
    variantIndex: number,
    key: string,
    value: string
  ) => {
    if (key && value) {
      const currentAttributes =
        form.getValues(`variants.${variantIndex}.attributes`) || {};
      form.setValue(`variants.${variantIndex}.attributes`, {
        ...currentAttributes,
        [key]: value,
      });
    }
  };

  const removeVariantAttribute = (variantIndex: number, key: string) => {
    const currentAttributes =
      form.getValues(`variants.${variantIndex}.attributes`) || {};
    const { [key]: removed, ...rest } = currentAttributes;
    form.setValue(`variants.${variantIndex}.attributes`, rest);
  };

  const handleUploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadFile(formData);

        return res;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls;
    } catch (error) {
      toastifyUtils("error", "Tải lên hình ảnh thất bại!");
      throw error;
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      // ----- Product Images -----
      const productFileImages = data.images.filter(
        (img): img is File => img instanceof File
      );
      const productUploadedUrls =
        productFileImages.length > 0
          ? await handleUploadImages(productFileImages)
          : [];

      const productImages = [
        ...data.images.filter((img): img is string => typeof img === "string"),
        ...productUploadedUrls,
      ];

      // ----- Variant Images -----
      const variants = await Promise.all(
        data.variants.map(async (v) => {
          const variantFileImages = v.images.filter(
            (img): img is File => img instanceof File
          );
          const variantUploadedUrls =
            variantFileImages.length > 0
              ? await handleUploadImages(variantFileImages)
              : [];

          return {
            ...v,
            images: [
              ...v.images.filter(
                (img): img is string => typeof img === "string"
              ),
              ...variantUploadedUrls,
            ],
          };
        })
      );

      // ----- Payload cuối cùng -----
      const payload = {
        ...data,
        images: productImages,
        variants,
      };

      if (isCreateProduct) {
        await createNewProduct(payload);
        toastifyUtils("success", "Sản phẩm đã được tạo thành công!");
      } else {
        await updateProduct(String(params.id), payload);
        toastifyUtils("success", "Sản phẩm đã được cập nhật thành công!");
      }

      form.reset();
    } catch (error) {
      console.error("Error creating product:", error);
      toastifyUtils("error", "Có lỗi xảy ra khi tạo sản phẩm");
    } finally {
      setIsLoading(false);
      router.push("/admin/products");
    }
  };

  const selectedProductType = form.watch("productType");
  const availableAttributes = selectedProductType
    ? ATTRIBUTE_OPTIONS[selectedProductType]
    : [];

  const getLookUp = async () => {
    const params: IApiParams = {
      limit: 100,
    };
    try {
      const getBrands = await getAllBrands(params);
      setBRANDS(
        getBrands.data.items.map((item: IBrand) => ({
          value: item._id,
          label: item.name,
        }))
      );

      const getCategories = await getAllCategories(params);
      setCATEGORIES(
        getCategories.data.items.map((item: ICategory) => ({
          value: item._id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log("Error fetching lookup: ", error);
    }
  };

  const getProductDetail = async () => {
    try {
      const product = await getProductById(String(params.id));
      console.log(product);
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        brand: product.brand,
        category: product.category,
        productType: product.productType,
        allowedAttributes: product.allowedAttributes,
        variants: product.variants.map((v: any) => ({
          sku: v.sku,
          slug: v.slug,
          price: v.price,
          stock: v.stock,
          attributes: v.attributes,
          images: v.images,
        })),
        images: product.images,
        discount: product.discount,
      });
    } catch (error) {
      toastifyUtils("error", "Có lỗi xảy ra khi lấy chi tiết sản phẩm");
      console.error("Error fetching product detail: ", error);
    }
  };

  useEffect(() => {
    getLookUp();
    if (!isCreateProduct) {
      getProductDetail();
    }
  }, [params?.id]);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isCreateProduct ? "Tạo sản phẩm mới" : "Chi tiết sản phẩm"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Tạo sản phẩm với nhiều biến thể và thuộc tính tùy chỉnh
        </p>
      </div>

      <LoadingWrapper
        isLoading={isLoading}
        overlay
        fullScreen
        text="Đang lưu dữ liệu"
        size="md"
      >
        <Form {...form}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Product Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem
                            className={`${isCreateProduct && "col-span-2"}`}
                          >
                            <FormLabel>Tên sản phẩm *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên sản phẩm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!isCreateProduct && (
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="auto-generated-slug"
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Danh mục *</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thương hiệu *</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn thương hiệu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {BRANDS.map((brand) => (
                                  <SelectItem
                                    key={brand.value}
                                    value={brand.value}
                                  >
                                    {brand.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại sản phẩm *</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PRODUCT_TYPES.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả sản phẩm</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mô tả chi tiết về sản phẩm..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hình ảnh sản phẩm chung</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Hình ảnh đại diện cho toàn bộ sản phẩm
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              value={field.value || []}
                              onChange={(files) => field.onChange(files)}
                              multiple
                              maxFiles={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Allowed Attributes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thuộc tính được phép</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Định nghĩa các thuộc tính mà biến thể có thể sử dụng
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Predefined attributes */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Thuộc tính có sẵn:
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={attributeInput}
                          onValueChange={setAttributeInput}
                          disabled={!availableAttributes?.length}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn thuộc tính" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAttributes.map((attr) => (
                              <SelectItem key={attr} value={attr}>
                                {attr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={addAllowedAttribute}
                          size="sm"
                          disabled={!availableAttributes?.length}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Custom attributes */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Thuộc tính tùy chỉnh:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập tên thuộc tính mới"
                          value={newAttributeName}
                          onChange={(e) => setNewAttributeName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addCustomAttribute}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {form
                        .watch("allowedAttributes")
                        .map((attribute, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {attribute}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeAllowedAttribute(index)}
                            />
                          </Badge>
                        ))}
                    </div>
                    <FormMessage />
                  </CardContent>
                </Card>

                {/* Product Variants */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Biến thể sản phẩm</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Quản lý các biến thể khác nhau của sản phẩm
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendVariant({
                          sku: "",
                          slug: "",
                          price: 0,
                          stock: 0,
                          attributes: {},
                          images: [],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm biến thể
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {variantFields.map((variant, index) => (
                        <VariantItem
                          key={variant.id}
                          variant={variant}
                          index={index}
                          form={form}
                          variantFields={variantFields}
                          isCreateProduct={isCreateProduct}
                          removeVariant={removeVariant}
                          addVariantAttribute={addVariantAttribute}
                          removeVariantAttribute={removeVariantAttribute}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-6">
                {/* Discount */}
                <Card>
                  <CardHeader>
                    <CardTitle>Khuyến mãi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giảm giá (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
                            Nhập số từ 0-100 (%)
                          </p>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Xem trước</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Tên:</span>
                        <span className="text-right">
                          {form.watch("name") || "Chưa có"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Slug:</span>
                        <span className="text-right text-muted-foreground">
                          {form.watch("slug") || "chưa-có"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Loại:</span>
                        <span className="text-right">
                          {PRODUCT_TYPES.find(
                            (t) => t.value === form.watch("productType")
                          )?.label || "Chưa chọn"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Thương hiệu:</span>
                        <span className="text-right">
                          {BRANDS.find((b) => b.value === form.watch("brand"))
                            ?.label || "Chưa chọn"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Danh mục:</span>
                        <span className="text-right">
                          {CATEGORIES.find(
                            (c) => c.value === form.watch("category")
                          )?.label || "Chưa chọn"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Số biến thể:</span>
                        <span className="text-right font-semibold text-blue-600">
                          {variantFields.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Thuộc tính:</span>
                        <span className="text-right font-semibold text-green-600">
                          {form.watch("allowedAttributes").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Giảm giá:</span>
                        <span className="text-right">
                          {form.watch("discount")}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hình ảnh chung:</span>
                        <span className="text-right">
                          {form.watch("images").length} ảnh
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tóm tắt giá</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      {variantFields.map((_, index) => {
                        const variant = form.watch(`variants.${index}`);
                        const price = variant?.price || 0;
                        const discountedPrice =
                          price * (1 - form.watch("discount") / 100);

                        return (
                          <div key={index} className="border-b pb-2">
                            <div className="font-medium">
                              Biến thể #{index + 1}{" "}
                              {variant?.sku && `(${variant.sku})`}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Giá gốc:</span>
                              <span>{price.toLocaleString("vi-VN")}đ</span>
                            </div>
                            {form.watch("discount") > 0 && (
                              <div className="flex justify-between text-xs font-medium text-red-600">
                                <span>Giá sau giảm:</span>
                                <span>
                                  {discountedPrice.toLocaleString("vi-VN")}đ
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Tồn kho:</span>
                              <span>{variant?.stock || 0}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Validation Summary */}
                {/* <FormStatusCard form={form} /> */}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end items-center pt-6 border-t bg-white sticky bottom-0 z-10 pb-4">
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={form.handleSubmit(onSubmit, errorFunc)}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tạo...
                    </div>
                  ) : isCreateProduct ? (
                    "Tạo sản phẩm"
                  ) : (
                    "Cập nhật sản phẩm"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </LoadingWrapper>

      {/* <FormDebugPanel form={form} /> */}
    </div>
  );
}
