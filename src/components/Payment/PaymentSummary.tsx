import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Package2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormData } from "@/lib/schema";
import Image from "next/image";
import { Button } from "../ui/button";
import { calculateDiscountedPrice } from "@/utils/formatPrice";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface PaymentSummaryProps {
  form: UseFormReturn<PaymentFormData>;
}

export default function PaymentSummary({ form }: PaymentSummaryProps) {
  const items = form.watch("items");
  const { clearCart } = useCartStore();
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => {
    const price = calculateDiscountedPrice(
      item.price ?? 0,
      item.discountPercent ?? 0
    );
    const qty = parseInt(item.quantity || "0", 10);
    return sum + price * qty;
  }, 0);

  const discount = 0;
  const shipping: number = 0;
  const total = subtotal - discount + shipping;

  const handleBackToCart = () => {
    clearCart();
    router.push("/cart")
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-semibold text-xl">
            <Package2 color="blue" /> Đơn hàng của bạn
          </h3>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Danh sách sản phẩm */}
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 border-b pb-4 last:border-none"
              >
                <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Sản phẩm"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between text-sm flex-1">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.name || "Tên sản phẩm"}
                    </div>
                    <div className="text-gray-500">{item.variantSku}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {calculateDiscountedPrice(
                        item.price ?? 0,
                        item.discountPercent ?? 0
                      ).toLocaleString()}
                      ₫
                    </span>
                    <span className="text-gray-600">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng kết */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span className="font-medium">{subtotal.toLocaleString()}₫</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-red-500">
                -{discount.toLocaleString()}₫
              </span>
            </div> */}
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-medium">
                {shipping === 0 ? "Miễn phí" : `${shipping?.toLocaleString()}₫`}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t pt-3">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{total.toLocaleString()}₫</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full h-12 bg-brandeisBlue" type="submit">
            Đặt hàng
          </Button>
          <Button
            className="w-full h-12 text-brandeisBlue font-semibold hover:bg-transparent hover:underline"
            type="button"
            variant={"ghost"}
            onClick={handleBackToCart}
          >
            Quay lại giỏ hàng
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
