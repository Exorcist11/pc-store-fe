"use client";
import { Variant } from "@/interface/product.interface";
import { useEffect, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  selectedVariant?: Variant;
}

export default function ProductGallery({
  images,
  selectedVariant,
}: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col">
        <div className="w-full h-96 border rounded-lg overflow-hidden flex items-center justify-center bg-white">
          <img
            src={mainImage}
            alt="Product"
            className="max-h-full object-contain"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`w-20 h-20 border rounded cursor-pointer flex items-center justify-center bg-white ${
                mainImage === img ? "border-blue-600" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Variant Details */}
      {selectedVariant && (
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-bold text-lg text-gray-800 ">
              📋 Thông số kỹ thuật
            </h4>
          </div>
          <div className="mb-6 p-5 rounded-xl shadow-lg border border-gray-100 bg-white">
            <div className="space-y-2 text-sm">
              {Object.entries(selectedVariant.attributes).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center py-2 border-b border-gray-50 last:border-b-0"
                  >
                    <span className="w-2/5 text-gray-600 font-medium">
                      {key}:
                    </span>
                    <span className="w-3/5 font-semibold text-gray-800">
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
