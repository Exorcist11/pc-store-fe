"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Lock, ShieldCheck } from "lucide-react";
import { Separator } from "../ui/separator";

interface CartSummaryProps {
  totalItems: number;
  subtotal: number;
  shippingFee?: number | "free";
  total: number;
  onCheckout?: () => void;
}

export default function CartSummary({
  totalItems,
  subtotal,
  shippingFee = "free",
  total,
  onCheckout,
}: CartSummaryProps) {
  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <Card className="w-full">
      <CardHeader className="text-lg font-semibold">
        Tóm tắt đơn hàng
      </CardHeader>

      <div className="px-4 pb-5">
        <Separator />
      </div>

      <CardContent className="flex flex-col gap-5">
        {/* Subtotal */}
        <div className="flex justify-between font-medium w-full text-sm">
          <h3>Tạm tính ({totalItems} sản phẩm)</h3>
          <h3>{formatCurrency(subtotal)}</h3>
        </div>

        {/* Shipping */}
        <div className="flex justify-between font-medium w-full text-sm">
          <h3>Phí vận chuyển</h3>
          <h3>
            {shippingFee === "free"
              ? "Miễn phí"
              : formatCurrency(shippingFee as number)}
          </h3>
        </div>
      </CardContent>

      <div className="px-4 pb-5">
        <Separator />
      </div>

      <CardFooter className="flex flex-col gap-3">
        {/* Total */}
        <div className="flex justify-between font-semibold text-brandeisBlue w-full text-lg">
          <h3>Tổng cộng</h3>
          <h3>{formatCurrency(total)}</h3>
        </div>

        {/* Checkout button */}
        <Button
          className="w-full font-semibold hover:bg-brandeisBlue h-12"
          onClick={onCheckout}
        >
          <Lock />
          Tiến hành thanh toán
        </Button>

        {/* Secure text */}
        <div className="text-sm flex items-center gap-2 text-gray-500 mt-3">
          <ShieldCheck size={14} color="green" />
          Thông tin thanh toán được bảo mật
        </div>
      </CardFooter>
    </Card>
  );
}
