"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { getAllBrands } from "@/services/brand";
import { IBrand } from "@/interface/brands.interface";

export default function BrandCarousel() {
  const [brands, setBrands] = useState<{ name: string; logo: string }[]>([]);
  const getBrands = async () => {
    try {
      const response = await getAllBrands({ limit: 100 });
      setBrands(
        response.data.items.map((item: IBrand) => ({
          name: item.name,
          logo: item.logo,
        }))
      );
    } catch (error) {
      console.log("Error fetching brands: ", error);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    scrollInterval.current = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 2000);

    return () => {
      if (scrollInterval.current !== null)
        clearInterval(scrollInterval.current);
    };
  }, [emblaApi]);

  return (
    <section className="py-12 bg-surface-muted">
      <div className="container mx-auto">
        <div className="text-3xl font-bold mb-8 text-neutral-900 text-center flex items-center flex-col gap-2">
          Thương hiệu nổi bật
          <Separator className="w-[200px] h-1 bg-brandeisBlue" />
        </div>

        <div className="overflow-hidden py-3" ref={emblaRef}>
          <div className="flex gap-6">
            {brands.concat(brands).map((brand, idx) => (
              <Card
                key={idx}
                className="flex-shrink-0 w-1/5 transition-transform transform
                   hover:-translate-y-2 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
              >
                <CardContent className="p-0">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="rounded-lg w-full h-full object-cover transition-all grayscale hover:grayscale-0"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
