"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IBrand } from "@/interface/brands.interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "@/lib/schema";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";
import { errorFunc } from "@/lib/errorFunc";
import slugify from "slugify"; // Import thư viện slugify

export default function ProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [initialData, setInitialData] = useState<IBrand | undefined>(undefined);
  const [socketInput, setSocketInput] = useState("");
  const [memoryTypeInput, setMemoryTypeInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const isCreate = params?.id === "new";

  const CATEGORIES = [
    { value: "64f92e8e8c9e2f0c12345670", label: "Bộ vi xử lý" },
    { value: "64f92e8e8c9e2f0c12345671", label: "Card đồ họa" },
    { value: "64f92e8e8c9e2f0c12345672", label: "Bộ nhớ RAM" },
  ];

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      categoryId: "",
      brandId: "",
      productType: "",
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      stock: 0,
      minStock: 0,
      weight: 0,
      shortDescription: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      compatibility: { sockets: [], memoryTypes: [], maxMemory: 0 },
      dimensions: { length: 0, width: 0, height: 0 },
      tags: [],
      images: [],
      isActive: true,
      isFeatured: false,
    },
  });

  // Tự động tạo slug khi tên sản phẩm thay đổi
  const name = form.watch("name");
  useEffect(() => {
    if (name) {
      const newSlug = slugify(name, { lower: true, strict: true });
      form.setValue("slug", newSlug);
    }
  }, [name, form]);

  useEffect(() => {
    // fetch dữ liệu nếu là chỉnh sửa
  }, [params?.id, isCreate]);

  const onSubmit = (data: ProductFormData) => {
    console.log("Form submitted:", data);
  };

  const addSocket = () => {
    if (socketInput) {
      form.setValue("compatibility.sockets", [
        ...form.getValues("compatibility.sockets"),
        socketInput,
      ]);
      setSocketInput("");
    }
  };

  const removeSocket = (index: number) => {
    const updated = [...form.getValues("compatibility.sockets")];
    updated.splice(index, 1);
    form.setValue("compatibility.sockets", updated);
  };

  const addMemoryType = () => {
    if (memoryTypeInput) {
      form.setValue("compatibility.memoryTypes", [
        ...form.getValues("compatibility.memoryTypes"),
        memoryTypeInput,
      ]);
      setMemoryTypeInput("");
    }
  };

  const removeMemoryType = (index: number) => {
    const updated = [...form.getValues("compatibility.memoryTypes")];
    updated.splice(index, 1);
    form.setValue("compatibility.memoryTypes", updated);
  };

  const addTag = () => {
    if (tagInput) {
      form.setValue("tags", [...form.getValues("tags"), tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const updated = [...form.getValues("tags")];
    updated.splice(index, 1);
    form.setValue("tags", updated);
  };

  return (
    <div className="px-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">
        {isCreate ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, errorFunc)}
          className="space-y-6"
        >
          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="md:col-span-2 space-y-6">
              {/* Hình ảnh */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh</CardTitle>
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

              {/* Thông tin cơ bản */}
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
                        <FormItem>
                          <FormLabel>Tên sản phẩm</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên sản phẩm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (đường dẫn)</FormLabel>
                          <FormControl>
                            <Input placeholder="vd: cpu-intel-i9" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thương hiệu</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập thương hiệu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập mã SKU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại sản phẩm</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập loại sản phẩm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Mô tả sản phẩm */}
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <Input placeholder="Mô tả ngắn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả chi tiết"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Khả năng tương thích */}
              <Accordion type="single" collapsible>
                <AccordionItem value="compatibility">
                  <AccordionTrigger>Khả năng tương thích</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="space-y-4 p-6">
                        <FormField
                          control={form.control}
                          name="compatibility.sockets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Socket</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    value={socketInput}
                                    onChange={(e) =>
                                      setSocketInput(e.target.value)
                                    }
                                    placeholder="Thêm socket (vd: LGA1200)"
                                  />
                                  <Button type="button" onClick={addSocket}>
                                    Thêm
                                  </Button>
                                </div>
                              </FormControl>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value.map((socket, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {socket}
                                    <X
                                      size={12}
                                      className="cursor-pointer"
                                      onClick={() => removeSocket(index)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="compatibility.memoryTypes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại bộ nhớ</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    value={memoryTypeInput}
                                    onChange={(e) =>
                                      setMemoryTypeInput(e.target.value)
                                    }
                                    placeholder="Thêm loại bộ nhớ (vd: DDR4)"
                                  />
                                  <Button type="button" onClick={addMemoryType}>
                                    Thêm
                                  </Button>
                                </div>
                              </FormControl>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value.map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {type}
                                    <X
                                      size={12}
                                      className="cursor-pointer"
                                      onClick={() => removeMemoryType(index)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="compatibility.maxMemory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bộ nhớ tối đa (GB)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Giá và kho */}
              <Card>
                <CardHeader>
                  <CardTitle>Giá & Kho</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comparePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá gốc (so sánh)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá vốn</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho tối thiểu</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Trạng thái & Thẻ */}
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái & Thẻ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích hoạt</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nổi bật</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thẻ (tags)</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="Thêm thẻ (vd: gaming)"
                            />
                            <Button type="button" onClick={addTag}>
                              Thêm
                            </Button>
                          </div>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <X
                                size={12}
                                className="cursor-pointer"
                                onClick={() => removeTag(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Thuộc tính vật lý */}
              <Accordion type="single" collapsible>
                <AccordionItem value="physical-attributes">
                  <AccordionTrigger>Thuộc tính vật lý</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="space-y-4 p-6">
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trọng lượng (kg)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name="dimensions.length"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dài (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensions.width"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rộng (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensions.height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cao (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* SEO & Nâng cao */}
              <Accordion type="single" collapsible>
                <AccordionItem value="seo">
                  <AccordionTrigger>SEO & Nâng cao</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="space-y-4 p-6">
                        <FormField
                          control={form.control}
                          name="seoTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Title</FormLabel>
                              <FormControl>
                                <Input placeholder="SEO Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="seoDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="SEO Description"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* Sticky footer */}
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
            <Button type="submit">
              {isCreate ? "Tạo sản phẩm" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
