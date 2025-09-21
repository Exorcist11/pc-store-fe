"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus, Trash } from "lucide-react";
import { Control, Controller, useWatch } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"; // shadcn checkbox
import { calculateDiscountedPrice } from "@/utils/formatPrice";

interface Spec {
  label: string;
}

interface CartItemProps {
  id: string;
  variant: string;
  name: string;
  imageUrl: string;
  specs: Spec[];
  originalPrice: number;
  currentPrice: number;
  discountPercent?: number;
  control: Control<any>;
  index: number;
  onRemove?: () => void;
  stock: number;
}

export default function CartItem({
  id,
  variant,
  name,
  imageUrl,
  specs,
  originalPrice,
  currentPrice,
  discountPercent,
  control,
  index,
  onRemove,
  stock,
}: CartItemProps) {
  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const qty = useWatch({
    control,
    name: `items.${index}.qty`,
  });

  return (
    <div
      className="flex flex-col  md:flex-row gap-4 p-4 mb-4"
      data-product-id={id}
      data-variant={variant}
    >
      {/* Checkbox */}
      <Controller
        name={`items.${index}.selected`}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
          />
        )}
      />

      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Info */}
      <CardContent className="flex flex-col justify-between flex-1 p-0">
        <div>
          <h3 className="font-semibold text-lg mb-2">{name}</h3>
          <div className="text-sm text-muted-foreground">
            {specs.map((spec, i) => (
              <span key={i}>
                {spec.label}
                {i < specs.length - 1 && " | "}
              </span>
            ))}
          </div>
        </div>

        {/* Quantity Control */}
        <div className="flex items-center gap-2">
          <Controller
            name={`items.${index}.qty`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2  border rounded-md">
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="text"
                  readOnly
                  value={field.value}
                  className="w-12 text-center focus-visible:ring-offset-0 focus-visible:ring-0 py-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    field.onChange(Math.min(stock, field.value + 1))
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          />

          <Button variant="ghost" size="icon" type="button" onClick={onRemove}>
            <Trash color="red" className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>

      {/* Price */}
      <div className="flex flex-col items-end  gap-1">
        {discountPercent && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg mb-1">
            -{discountPercent}%
          </div>
        )}
        <div className="line-through text-sm text-muted-foreground">
          {formatCurrency(originalPrice)}
        </div>
        <div className="font-bold text-lg text-brandeisBlue">
          {formatCurrency(
            calculateDiscountedPrice(originalPrice, discountPercent ?? 0)
          )}
        </div>
        <div className="text-sm ">
          {formatCurrency(
            calculateDiscountedPrice(originalPrice, discountPercent ?? 0) * qty
          )}
        </div>
      </div>
    </div>
  );
}
