"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Edit,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orders";
import { Order } from "@/interface/order.interface";
import LoadingWrapper from "@/components/Loading/LoadingWrapper";

const AdminOrderDetail = () => {
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderData, setOrderDetail] = useState<Order>();
  const params = useParams();
  const [city, setCity] = useState<any>();
  const [state, setState] = useState<any>();
  console.log("CHECK: ", city?.name, state?.name);

  const getOrder = async () => {
    try {
      const order = await getOrderById(String(params?.id));
      console.log("ORDER", order);
      setOrderDetail(order);
    } catch (error) {
      console.error("Error fetching product detail: ", error);
    }
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "unpaid":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const statusTranslations: any = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đã giao vận",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };

  const paymentStatusTranslations: any = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refunded: "Đã hoàn tiền",
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrderStatus(newStatus);
    setIsUpdating(false);
    console.log("Updating order status to:", newStatus);
  };

  const handlePaymentStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPaymentStatus(newStatus);
    setIsUpdating(false);
    console.log("Updating payment status to:", newStatus);
  };

  useEffect(() => {
    if (params?.id) {
      getOrder();
    }
  }, [params?.id]);

  useEffect(() => {
    if (orderData) {
      fetch(
        `https://provinces.open-api.vn/api/v2/w/${orderData?.shippingAddress.state}`
      )
        .then((res) => res.json())
        .then((data) => setState(data));
      fetch(
        `https://provinces.open-api.vn/api/v2/p/${orderData?.shippingAddress.city}`
      )
        .then((res) => res.json())
        .then((data) => setCity(data));
    }
  }, [orderData]);

  if (!orderData) {
    // You can replace this with a more sophisticated loading spinner component
    return <LoadingWrapper isLoading={true}></LoadingWrapper>;
  }

  return (
    <LoadingWrapper isLoading={!orderData}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Đơn hàng #{(orderData?._id ?? "").slice(-8)}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {orderData?.createdAt
                        ? formatDate(orderData.createdAt)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>
                      {orderData?.isGuest ? "Khách vãng lai" : "Thành viên"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(orderData?.total ?? 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tổng giá trị</div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="w-5 h-5" />
                    <span>Trạng thái đơn hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Trạng thái xử lý
                      </label>
                      <Select
                        value={orderStatus}
                        onValueChange={handleStatusUpdate}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="shipped">Đã giao vận</SelectItem>
                          <SelectItem value="delivered">Đã giao</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Trạng thái thanh toán
                      </label>
                      <Select
                        value={paymentStatus}
                        onValueChange={handlePaymentStatusUpdate}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">
                            Chưa thanh toán
                          </SelectItem>
                          <SelectItem value="paid">Đã thanh toán</SelectItem>
                          <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Badge variant={getStatusVariant(orderStatus)}>
                      {statusTranslations[orderStatus]}
                    </Badge>
                    <Badge variant={getPaymentStatusVariant(paymentStatus)}>
                      {paymentStatusTranslations[paymentStatus]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Sản phẩm ({orderData?.items?.length ?? 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData?.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex space-x-4 p-4 border rounded-lg"
                      >
                        <Avatar className="w-16 h-16 rounded-md">
                          <AvatarImage
                            src={item.product?.images?.[0]}
                            alt={item.product.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-md">
                            <Package className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium leading-none">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.variantSku}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.product?.description?.substring(0, 100)}...
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="font-medium">
                            {formatCurrency(item.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity}
                          </div>
                          {item.product?.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{item.product.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {orderData?.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ghi chú đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertDescription>{orderData.notes}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Thông tin khách hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {orderData.guestInfo?.firstName?.charAt(0) ?? ""}
                        {orderData.guestInfo?.lastName?.charAt(0) ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {orderData.guestInfo?.firstName}{" "}
                        {orderData.guestInfo?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {orderData?.isGuest ? "Khách vãng lai" : "Thành viên"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {orderData.guestInfo?.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {orderData.guestInfo?.phone}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Địa chỉ giao hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">
                    {orderData.shippingAddress?.recipientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress?.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {city?.name}, {state?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress?.country}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Thông tin thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">
                      Phương thức thanh toán
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderData?.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng (COD)"
                        : orderData.paymentMethod}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(orderData?.total ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">
                        {formatCurrency(orderData?.total ?? 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full" disabled={isUpdating}>
                  {isUpdating ? "Đang cập nhật..." : "In hóa đơn"}
                </Button>
                <Button variant="outline" className="w-full">
                  Gửi email cho khách hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default AdminOrderDetail;
