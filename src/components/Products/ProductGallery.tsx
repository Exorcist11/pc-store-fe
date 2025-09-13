"use client";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
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
  );
}
