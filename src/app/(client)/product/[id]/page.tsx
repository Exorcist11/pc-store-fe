"use client";

import FeaturedProducts from "@/components/Homepage/FeaturedProduct";
import ProductGallery from "@/components/Products/ProductGallery";
import ProductInfo from "@/components/Products/ProductInfo";
import ProductTabs from "@/components/Products/ProductTabs";

export default function ProductDetail() {
  const images = [
    "https://res.cloudinary.com/deyszirfc/image/upload/v1757758594/ranqsjux9sgmfqzarghu.webp",
    "https://res.cloudinary.com/deyszirfc/image/upload/v1757758594/huvmc2nrg3l0h7m4qyuq.webp",
    "https://res.cloudinary.com/deyszirfc/image/upload/v1757758594/aywieke3sbomwlmkgsrl.webp",
    "https://res.cloudinary.com/deyszirfc/image/upload/v1757758595/jx07jxzugqjcc8ki1ank.webp",
  ];

  const tabs = [
    {
      id: "specs",
      label: "Thông số kỹ thuật",
      content: (
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg p-3">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <th className="px-4 py-2 w-1/3 font-medium text-gray-500">
                  CPU
                </th>
                <td className="px-4 py-2">
                  AMD Ryzen 5 7430U (6 lõi, 12 luồng, max 4.3GHz)
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-500">RAM</th>
                <td className="px-4 py-2">16GB</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-500">Ổ cứng</th>
                <td className="px-4 py-2">512GB SSD PCIe NVMe</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-500">
                  Card đồ họa
                </th>
                <td className="px-4 py-2">AMD Radeon Graphics</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "description",
      label: "Mô tả",
      content: (
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg p-3">
          <p>
            Máy tính xách tay cao cấp, hiệu năng mạnh mẽ, thiết kế mỏng nhẹ, phù
            hợp học tập và làm việc.
          </p>
        </div>
      ),
    },
    {
      id: "reviews",
      label: "Đánh giá",
      content: (
        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg p-3">
          <p>Hiện chưa có đánh giá nào.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto grid md:grid-cols-2 gap-8 mt-[160px] ">
      <ProductGallery images={images} />
      <ProductInfo
        title="Laptop ASUS ROG Strix G15"
        rating={4.5}
        reviews={12}
        price={28990000}
        oldPrice={31990000}
        discount="10%"
        sku="ROG-G15-2025"
        stock={5}
        brand="ASUS"
        category="Laptop Gaming"
        description="Laptop mạnh mẽ, thiết kế hiện đại, hỗ trợ học tập và giải trí."
      />
      <div className="md:col-span-2">
        <ProductTabs tabs={tabs} />
      </div>

      <div className="col-span-2">
        <FeaturedProducts />
      </div>
    </div>
  );
}
