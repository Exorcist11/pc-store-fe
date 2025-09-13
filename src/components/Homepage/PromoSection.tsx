"use client";

import { Button } from "@/components/ui/button";

const promos = [
  {
    title: "Giảm giá đến 30%",
    desc: "Cho tất cả sản phẩm Laptop Gaming trong tháng 10",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "#",
    btnText: "Mua ngay",
  },
  {
    title: "PC Gaming mạnh mẽ",
    desc: "Trải nghiệm game với cấu hình đỉnh cao",
    image:
      "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "#",
    btnText: "Khám phá ngay",
  },
];

export default function PromoSection() {
  return (
    <section className="py-12 bg-surface-muted">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((promo, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:-translate-y-1"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-64 object-cover transition-transform transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold">{promo.title}</h3>
                <p className="mt-2 text-sm">{promo.desc}</p>
                <Button
                  asChild
                  size="sm"
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <a href={promo.link}>{promo.btnText}</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
