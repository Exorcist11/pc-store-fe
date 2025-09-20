"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ProductVariant {
  price: number;
}

interface Product {
  slug: string;
  name: string;
  discount?: number;
  images: string[];
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const discountedPrice =
    product?.variants[0]?.price * (1 - (product?.discount ?? 0) / 100);

  return (
    <Card
      onClick={() => router.push(`/product/${product.slug}`)}
      className="hover:cursor-pointer overflow-visible transition-transform transform hover:-translate-y-2 hover:scale-105 shadow-sm hover:shadow-lg"
    >
      <div className="relative">
        {(product.discount || product?.discount !== 0) && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Giảm {product.discount}%
          </span>
        )}

        <img
          src={product?.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t"
        />
      </div>

      <CardContent className="flex flex-col gap-2 p-4 ">
        <h3 className="text-sm font-semibold line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-brandeisBlue">
            {discountedPrice.toLocaleString("vi-VN")}đ
          </span>
          {(product.discount || product?.discount !== 0) && (
            <span className="text-sm text-slate-500 line-through">
              {product?.variants[0].price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <div
          className="flex items-center justify-between mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button size="sm" className="flex-1">
            Thêm vào giỏ
          </Button>
          <button className="p-2 text-muted hover:text-red-500">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
