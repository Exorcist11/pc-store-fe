"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Monitor, Cpu, Computer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { name: "Laptop", count: 125, icon: <Laptop size={52} /> },
  { name: "PC - Máy tính để bàn", count: 87, icon: <Computer size={52} /> },
  { name: "Linh kiện máy tính", count: 256, icon: <Cpu size={52} /> },
  { name: "Màn hình", count: 64, icon: <Monitor size={52} /> },
];

export default function CategorySection() {
  return (
    <section className="py-12 bg-surface-muted">
      <div className="container mx-auto ">
        <div className="text-3xl font-bold mb-8 text-neutral-900 text-center flex items-center flex-col gap-2">
          Danh mục sản phẩm
          <Separator className="w-[200px] h-1 bg-brandeisBlue" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="flex flex-col items-center justify-center p-6 cursor-pointer
                         bg-white hover:bg-gray-50 shadow-sm hover:shadow-lg
                         transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-4 transition-transform duration-300 hover:scale-110 text-brandeisBlue">
                {category.icon}
              </div>
              <CardContent className="text-center p-0">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {category.count} sản phẩm
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
