"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { IProduct } from "@/interface/product.interface";
import { getFeatureProduct } from "@/services/products";
import { useRouter } from "next/navigation";
import ProductCard from "../Products/ProductCard";

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
            <ProductCard product={product} key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
