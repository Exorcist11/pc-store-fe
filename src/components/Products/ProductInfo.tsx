"use client";
import { IProductPublic, Variant } from "@/interface/product.interface";
import { shortenCPUName } from "@/utils/formatCpu";
import { useState, useEffect } from "react";
import ProductCommitment from "./ProductCommitment";
import toastifyUtils from "@/utils/toastify";
import { IAddToCart } from "@/interface/cart.interface";
import { calculateDiscountedPrice } from "@/utils/formatPrice";
import { addToCart } from "@/services/cart";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: IProductPublic;
  selectedVariant?: Variant;
  setSelectedVariant: React.Dispatch<React.SetStateAction<Variant | undefined>>;
}

export default function ProductInfo({
  product,
  selectedVariant,
  setSelectedVariant,
}: ProductInfoProps) {
  const rating = 5;
  const reviews = 28;
  // Tìm variant đầu tiên còn hàng
  const { user } = useAuthStore();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [showAllVariants, setShowAllVariants] = useState(false);

  // Tính giá sau giảm giá

  const discountedPrice = calculateDiscountedPrice(
    selectedVariant?.price ?? 0,
    product.discount
  );
  const oldPrice = product.discount ? selectedVariant?.price : undefined;

  // Lấy tên ngắn của variant dựa trên thuộc tính chính
  const getVariantDisplayName = (variant: Variant) => {
    const cpu = variant.attributes.CPU || "";
    const ram = variant.attributes.RAM || "";
    const storage = variant.attributes["Ổ cứng"] || "";

    if (!cpu) return null;
    return `${shortenCPUName(cpu)} - ${ram} - ${storage.split(" ")[0]}`;
  };

  const handleAddToCart = async () => {
    try {
      if (product && selectedVariant && user) {
        const dataSend: IAddToCart = {
          user: user?._id ?? "",
          product: product._id,
          variantSku: selectedVariant.sku,
          quantity: quantity,
        };
        await addToCart(dataSend);
        toastifyUtils("success", "Thêm sản phẩm vào giỏ hàng thành công!");
      } else {
        router.push('/login')
      }
    } catch (error) {
      toastifyUtils("error", "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
      console.error("Error add to cart!");
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

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
            {discountedPrice.toLocaleString()}₫
          </span>
          {oldPrice && (
            <span className="line-through text-gray-500">
              {oldPrice.toLocaleString()}₫
            </span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Variant Selection - Hiển thị tất cả variants */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Chọn cấu hình:</h3>
            <button
              onClick={() => setShowAllVariants(!showAllVariants)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showAllVariants ? "Thu gọn" : "Xem tất cả"}
            </button>
          </div>

          <div className="space-y-2">
            {(showAllVariants
              ? product.variants
              : product.variants.slice(0, 3)
            ).map((variant) => {
              const variantDiscountedPrice = calculateDiscountedPrice(
                variant.price,
                product.discount
              );
              const isSelected = selectedVariant?._id === variant._id;
              const isOutOfStock = variant.stock === 0;

              return (
                <div
                  key={variant._id}
                  className={`
                  border rounded-lg p-3 cursor-pointer transition-all
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }
                  ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
                `}
                  onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getVariantDisplayName(variant) && (
                          <span className="font-medium text-sm">
                            {getVariantDisplayName(variant)}
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          SKU: {variant.sku}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {variant.attributes.CPU && (
                          <div className="truncate">
                            {variant.attributes.CPU.split("(")[0].trim()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">
                            {variantDiscountedPrice.toLocaleString()}₫
                          </span>
                          {product.discount && (
                            <span className="text-xs line-through text-gray-500">
                              {variant.price.toLocaleString()}₫
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-xs ${
                            variant.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {variant.stock > 0
                            ? `Còn ${variant.stock} sản phẩm`
                            : "Hết hàng"}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="ml-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {product.variants.length > 3 && !showAllVariants && (
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                Còn {product.variants.length - 3} cấu hình khác
              </span>
            </div>
          )}
        </div>

        {/* Meta Information */}
        {selectedVariant && (
          <div className="mb-4 space-y-1 text-sm">
            <div className="flex">
              <span className="w-32 text-gray-500">Mã sản phẩm:</span>
              <span className="font-medium">{selectedVariant.sku}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Tình trạng:</span>
              <span
                className={`font-medium ${
                  selectedVariant.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedVariant.stock > 0
                  ? `Còn hàng (${selectedVariant.stock})`
                  : "Hết hàng"}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Thương hiệu:</span>
              <span className="font-medium">{product.brand.name}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Danh mục:</span>
              <span className="font-medium">{product.category.name}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        {selectedVariant && (
          <div className="flex gap-2 mb-4">
            <div className="flex border rounded">
              <button
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                className="w-16 text-center border-l border-r py-2"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                min="1"
                max={selectedVariant.stock}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Delete"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              <button
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() =>
                  setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                }
              >
                +
              </button>
            </div>

            <button
              className="flex-1 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedVariant.stock === 0}
              onClick={() => handleAddToCart()}
            >
              🛒 Thêm vào giỏ
            </button>

            <button
              className="flex-1 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedVariant.stock === 0}
            >
              ⚡ Mua ngay
            </button>

            <button
              className={`w-12 border rounded hover:bg-gray-50 ${
                wishlist ? "text-red-500 border-red-200" : "text-gray-500"
              }`}
              onClick={() => setWishlist(!wishlist)}
            >
              {wishlist ? "❤️" : "🤍"}
            </button>
          </div>
        )}

        {/* Short Description */}
        <p className="text-gray-700 text-sm text-justify">
          {product.description}
        </p>
      </div>

      <ProductCommitment />
    </div>
  );
}
