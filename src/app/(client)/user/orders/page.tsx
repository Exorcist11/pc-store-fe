"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getOrderByUser } from "@/services/orders";
import { IApiOrderByUserParams } from "@/interface/shared/api";
import { useAuthStore } from "@/store/authStore";

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
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log("totalPages", totalPages);

  const getOrders = async (page = 1) => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const params: IApiOrderByUserParams = {
        userId: user._id,
        index: page,
        limit: 3,
        order: "desc",
        sort: "createdAt",
      };
      const res = await getOrderByUser(params);

      if (res?.data) {
        setOrders(res.data.items || []);
        setPage(res.data.index);
        setTotalPages(res?.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(page);
  }, [user, page]);

  if (loading)
    return (
      <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
    );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase ">Đơn hàng của tôi</h2>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Bạn chưa có đơn hàng nào.
        </div>
      )}

      {orders.map((order) => (
        <div key={order._id} className="border shadow-sm rounded-xl">
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2">
            <div className="text-sm text-muted-foreground space-x-2">
              <span className="font-medium text-foreground">
                Đơn hàng: {order._id.slice(-8).toUpperCase()}
              </span>
              <span>• Ngày đặt: {formatDate(order.createdAt)}</span>
            </div>
            <div className="mt-2 sm:mt-0">{getStatusBadge(order.status)}</div>
          </CardHeader>

          <div className="space-y-3 p-6">
            {order.items.map((item: any, idx: number) => {
              const variant = item.product.variants.find(
                (v: any) => v.sku === item.variantSku
              );
              const image =
                variant?.images?.[0] ||
                item.product.images?.[0] ||
                "/placeholder.png";

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-snug">
                      {item.product.name}
                    </p>
                    <p className="text-red-600 font-semibold text-sm mt-1">
                      {item.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              );
            })}

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
                <Button variant="link" className="text-blue-600 text-sm p-0">
                  Xem chi tiết &gt;
                </Button>
              </div>
            </Link>
          </div>
        </div>
      ))}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              <div className="flex items-center gap-2 px-3">
                <span className="text-sm text-muted-foreground">
                  Trang {page} / {totalPages}
                </span>
              </div>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
