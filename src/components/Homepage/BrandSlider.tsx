"use client";

import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "../ui/separator";

const brands = [
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    name: "Asus",
    logo: "https://commons.wikimedia.org/wiki/File:ASUS_Logo.svg",
  },
  {
    name: "Dell",
    logo: "https://commons.wikimedia.org/wiki/File:Dell-Logo.svg",
  },
  {
    name: "HP",
    logo: "https://commons.wikimedia.org/wiki/File:HP-original-logo-1954-trademark.svg",
  },
  {
    name: "Apple",
    logo: "https://en.wikipedia.org/wiki/File:Apple_logo_black.svg",
  },
  {
    name: "MSI",
    logo: "https://commons.wikimedia.org/wiki/File:Msi-Logo.jpg",
  },
  {
    name: "Logitech",
    logo: "https://commons.wikimedia.org/wiki/File:Logitech_logo.svg",
  },
  {
    name: "Razer",
    logo: "https://worldvectorlogo.com/logo/razer",
  },
  {
    name: "Corsair",
    logo: "https://commons.wikimedia.org/wiki/File:Corsair_2020_logo.svg",
  },
  {
    name: "Kingston",
    logo: "https://worldvectorlogo.com/logo/kingston-technology",
  },
];

export default function BrandCarousel() {
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
                className="flex-shrink-0 w-1/5 p-4 transition-transform transform
                           hover:-translate-y-2 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
              >
                <CardContent className="flex items-center justify-center p-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-16 object-contain grayscale hover:grayscale-0 transition-all"
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
