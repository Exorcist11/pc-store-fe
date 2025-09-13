"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Separator } from "@radix-ui/react-select";

const products = [
  {
    name: "Laptop Gaming ASUS ROG Strix G15",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    currentPrice: "32.990.000₫",
    oldPrice: "38.990.000₫",
    tag: "Giảm 15%",
  },
  {
    name: "MacBook Pro 14 inch M2 Pro 2023",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    currentPrice: "47.990.000₫",
  },
  {
    name: "PC Gaming Intel Core i7 RTX 4070",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    currentPrice: "45.990.000₫",
    tag: "Mới",
  },
  {
    name: "Laptop Dell XPS 13 Plus 9320",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    currentPrice: "39.990.000₫",
  },
];

export default function FeaturedProducts() {
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
              className="overflow-visible transition-transform transform hover:-translate-y-2 hover:scale-105 shadow-sm hover:shadow-lg"
            >
              <div className="relative">
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t"
                />
              </div>

              <CardContent className="flex flex-col gap-2 p-4">
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {product.currentPrice}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted line-through">
                      {product.oldPrice}
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
