"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Monitor, Cpu, Computer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getPublicCategory } from "@/services/categories";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  "Máy tính xách tay": <Laptop size={52} />,
  Laptop: <Laptop size={52} />,
  "Máy tính để bàn": <Computer size={52} />,
  "PC - Máy tính để bàn": <Computer size={52} />,
  "Linh kiện máy tính": <Cpu size={52} />,
  "Màn hình": <Monitor size={52} />,
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const getCategory = async () => {
    try {
      const response = await getPublicCategory({ limit: 4 });
      const data = response.data;

      const categories = data.map((cat: any) => ({
        ...cat,
        icon: iconMap[cat.name] ?? <Cpu size={52} />,
        count: cat.productCount,
      }));

      setCategories(categories);
    } catch (error) {
      console.error("Error fetching category: ", error);
      return [];
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <section className="py-12 bg-surface-muted">
      <div className="container mx-auto ">
        <div className="text-3xl font-bold mb-8 text-neutral-900 text-center flex items-center flex-col gap-2">
          Danh mục sản phẩm
          <Separator className="w-[200px] h-1 bg-brandeisBlue" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories?.map((category: any) => (
            <Card
              onClick={() => router.push(`/${category.slug}`)}
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
