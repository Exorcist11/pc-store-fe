"use client";
import { useState } from "react";

interface ProductInfoProps {
  title: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  discount?: string;
  sku: string;
  stock: number;
  brand: string;
  category: string;
  description: string;
}

export default function ProductInfo({
  title,
  rating,
  reviews,
  price,
  oldPrice,
  discount,
  sku,
  stock,
  brand,
  category,
  description,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < Math.floor(rating) ? "★" : i < rating ? "☆" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-gray-500 text-sm">({reviews} đánh giá)</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl font-bold text-blue-600">
          {price.toLocaleString()}₫
        </span>
        {oldPrice && (
          <span className="line-through text-gray-500">
            {oldPrice.toLocaleString()}₫
          </span>
        )}
        {discount && (
          <span className="bg-red-500 text-white px-2 py-1 rounded">
            {discount}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-4 space-y-1">
        <div className="flex">
          <span className="w-32 text-gray-500">Mã sản phẩm:</span>
          <span className="font-medium">{sku}</span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-500">Tình trạng:</span>
          <span
            className={`font-medium ${
              stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {stock > 0 ? `Còn hàng (${stock})` : "Hết hàng"}
          </span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-500">Thương hiệu:</span>
          <span className="font-medium">{brand}</span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-500">Danh mục:</span>
          <span className="font-medium">{category}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <div className="flex border rounded">
          <button
            className="px-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <input
            type="number"
            className="w-12 text-center border-l border-r"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
          <button
            className="px-3"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          >
            +
          </button>
        </div>
        <button className="flex-1 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
          🛒 Thêm vào giỏ
        </button>
        <button className="flex-1 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">
          ⚡ Mua ngay
        </button>
        <button
          className={`w-12 border rounded ${
            wishlist ? "text-red-500" : "text-gray-500"
          }`}
          onClick={() => setWishlist(!wishlist)}
        >
          {wishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Short Description */}
      <p>{description}</p>
    </div>
  );
}
