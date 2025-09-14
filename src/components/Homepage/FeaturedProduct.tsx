"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { IProduct } from "@/interface/product.interface";
import { getFeatureProduct } from "@/services/products";
import { useRouter } from "next/navigation";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const router = useRouter();
  const getFeaturesProduct = async () => {
    const response = await getFeatureProduct({ limit: 8 });
    setProducts(response.data.items);
  };

  useEffect(() => {
    getFeaturesProduct();
  }, []);
  return (
    <section className="py-12 bg-surface-muted">
      <div className="container mx-auto">
        <div className="text-3xl font-bold mb-8 text-neutral-900 text-center flex items-center flex-col gap-2">
          Sản phẩm nổi bật
          <Separator className="w-[200px] h-1 bg-brandeisBlue" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <Card
              key={idx}
              onClick={() => router.push(`/product/${product.slug}`)}
              className="hover:cursor-pointer overflow-visible transition-transform transform hover:-translate-y-2 hover:scale-105 shadow-sm hover:shadow-lg"
            >
              <div className="relative">
                {product.discount && (
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
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-brandeisBlue">
                    {(
                      product?.variants[0].price *
                      (1 - (product?.discount ?? 0) / 100)
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                  {product?.variants[0].price && (
                    <span className="text-sm text-slate-500 line-through">
                      {product?.variants[0].price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button size="sm" className="flex-1">
                    Thêm vào giỏ
                  </Button>
                  <button className="p-2 text-muted hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
