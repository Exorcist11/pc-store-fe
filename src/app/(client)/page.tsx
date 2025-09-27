"use client";

import BrandCarousel from "@/components/Homepage/BrandSlider";
import CategorySection from "@/components/Homepage/CategorySection";
import FeaturedProducts from "@/components/Homepage/FeaturedProduct";
import PromoSection from "@/components/Homepage/PromoSection";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="overflow-scroll hide-scrollbar">
      <div className="relative">
        <div className="relative w-full h-[700px] laptop:h-[800px]">
          <Image
            src="https://res.cloudinary.com/deyszirfc/image/upload/v1757776945/tt0gy2bz4lb7uveu5vnb.avif"
            alt="Sample Image"
            layout="fill"
            objectFit="cover"
            className="object-center"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl laptop:text-6xl font-bold mb-4">
              Hiệu Năng Đỉnh Cao <br /> Cho Game & Công Việc
            </h1>
            <p className="text-lg laptop:text-xl text-neutral-200 mb-8 max-w-2xl">
              Khám phá những mẫu laptop & PC gaming mới nhất, tối ưu cho trải
              nghiệm mượt mà và bền bỉ.
            </p>
            <div className="flex gap-4">
              <button className="bg-brandeisBlue hover:opacity-95 text-white font-semibold px-6 py-3 rounded-sm shadow">
                Mua ngay
              </button>
              <button className="bg-transparent border border-white hover:bg-white hover:text-brandeisBlue text-white font-semibold px-6 py-3 rounded-sm">
                Khám phá thêm
              </button>
            </div>
          </div>
        </div>

        <CategorySection />

        <FeaturedProducts />

        <PromoSection />

        <BrandCarousel />
      </div>
    </div>
  );
}
