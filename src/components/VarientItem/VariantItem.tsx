"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, X } from "lucide-react";
import { ImageUpload } from "../ImageUpload/ImageUpload";

interface VariantItemProps {
  variant: any;
  index: number;
  form: any;
  variantFields: any[];
  isCreateProduct: boolean;
  removeVariant: (index: number) => void;
  addVariantAttribute: (index: number, attrName: string, value: string) => void;
  removeVariantAttribute: (index: number, attrName: string) => void;
}

export default function VariantItem({
  variant,
  index,
  form,
  variantFields,
  isCreateProduct,
  removeVariant,
  addVariantAttribute,
  removeVariantAttribute,
}: VariantItemProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Biến thể #{index + 1}</h4>
        {variantFields.length > 1 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeVariant(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* SKU, Price, Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`variants.${index}.sku`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU *</FormLabel>
              <FormControl>
                <Input placeholder="SKU-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`variants.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="1000"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`variants.${index}.stock`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tồn kho</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Slug chỉ khi edit */}
      {!isCreateProduct && (
        <FormField
          control={form.control}
          name={`variants.${index}.slug`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug biến thể</FormLabel>
              <FormControl>
                <Input placeholder="auto-generated-variant-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Attributes */}
      <div className="space-y-2">
        <FormLabel>Thuộc tính biến thể</FormLabel>
        <div className="space-y-2">
          {form.watch("allowedAttributes").map((attrName: string) => (
            <div key={attrName} className="flex gap-2 items-center">
              <span className="text-sm font-medium w-32 flex-shrink-0">
                {attrName}:
              </span>
              <Input
                placeholder={`Nhập ${attrName.toLowerCase()}`}
                value={
                  form.watch(`variants.${index}.attributes`)?.[attrName] || ""
                }
                onChange={(e) =>
                  addVariantAttribute(index, attrName, e.target.value)
                }
                className="flex-1"
              />
              {form.watch(`variants.${index}.attributes`)?.[attrName] && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariantAttribute(index, attrName)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(form.watch(`variants.${index}.attributes`) || {}).map(
            ([key, value]) => (
              <Badge key={key} variant="outline" className="text-xs">
                {key}: {String(value)}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <FormLabel>Hình ảnh biến thể</FormLabel>
        <FormField
          control={form.control}
          name={`variants.${index}.images`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  value={field.value || []}
                  onChange={(files) => field.onChange(files)}
                  multiple
                  maxFiles={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />
    </div>
  );
}
