"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Đã xác nhận</Badge>;
    case "delivered":
      return <Badge className="bg-emerald-500">Đã nhận hàng</Badge>;
    case "pending":
      return <Badge className="bg-yellow-400 text-black">Đang xử lý</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-400">Đã hủy</Badge>;
    default:
      return <Badge variant="outline">Chờ xác nhận</Badge>;
  }
};

export default function OrdersPage() {
  const mockOrders = [
    {
      _id: "ac1",
      user: "ac",
      isGuest: false,
      guestInfo: null,
      items: [
        {
          product: "ac1",
          variantSku: "SPK-XIAOMI-001",
          quantity: 1,
          price: 960000,
          productName: "LOA VI TÍNH XIAOMI DESKTOP SPEAKER ĐEN",
          productImage: "",
        },
      ],
      total: 960000,
      status: "confirmed",
      paymentStatus: "paid",
      shippingAddress: {
        street: "123 Nguyễn Huệ",
        city: "Hồ Chí Minh",
        country: "Việt Nam",
        recipientName: "Nguyễn Văn A",
        phone: "0901234567",
      },
      paymentMethod: "cod",
      notes: "Giao giờ hành chính",
      isActive: true,
      createdAt: "2025-10-05T10:00:00Z",
    },
    {
      _id: "ac2",
      user: "ac",
      isGuest: false,
      items: [
        {
          product: "ac2",
          variantSku: "SSG-S23-128GB",
          quantity: 1,
          price: 12790000,
          productName: "SAMSUNG GALAXY S23 8GB 128GB XANH (S911)",
          productImage: "",
        },
      ],
      total: 12790000,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        street: "56 Lê Duẩn",
        city: "Đà Nẵng",
        country: "Việt Nam",
        recipientName: "Trần Thị B",
        phone: "0909876543",
      },
      paymentMethod: "credit_card",
      notes: "",
      isActive: true,
      createdAt: "2024-05-19T12:00:00Z",
    },
    {
      _id: "ac3",
      user: "ac3",
      isGuest: false,
      items: [
        {
          product: "ac",
          variantSku: "KVR32S22S8/8",
          quantity: 1,
          price: 590000,
          productName: "RAM LAPTOP KINGSTON 1.2V 8GB 3200MHz KVR32S22S8/8",
          productImage: "",
        },
      ],
      total: 590000,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        street: "88 Trần Hưng Đạo",
        city: "Hà Nội",
        country: "Việt Nam",
        recipientName: "Lê Văn C",
        phone: "0912345678",
      },
      paymentMethod: "bank_transfer",
      notes: "",
      isActive: true,
      createdAt: "2023-03-03T09:30:00Z",
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase ">Đơn hàng của tôi</h2>
      </div>

      {mockOrders.map((order) => (
        <div key={order._id.toString()} className="border shadow-sm rounded-xl">
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2">
            <div className="text-sm text-muted-foreground space-x-2">
              <span className="font-medium text-foreground">
                Đơn hàng: {order._id.toString().slice(-8).toUpperCase()}
              </span>
              <span>• Ngày đặt hàng: {formatDate(order.createdAt)}</span>
            </div>
            <div className="mt-2 sm:mt-0">{getStatusBadge(order.status)}</div>
          </CardHeader>

          <div className="space-y-3 p-6">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border-b last:border-b-0 pb-3 last:pb-0"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item?.productImage}
                    alt={item?.productName}
                    fill
                    className="object-cover rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-snug">
                    {item.productName}
                  </p>
                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Tổng thanh toán:
              </div>
              <div className="text-red-600 font-semibold text-base">
                {order.total.toLocaleString("vi-VN")}đ
              </div>
            </div>

            <Link href={`/user/orders/${order._id}`}>
              <div className="text-right">
                <Button variant="link" className="text-blue-600 text-sm p-0 ">
                  Xem chi tiết &gt;
                </Button>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
