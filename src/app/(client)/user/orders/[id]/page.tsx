"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orders";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
type PaymentStatus = "paid" | "unpaid";
type PaymentMethod = "cod" | "bank" | "ewallet";

interface OrderItem {
  product: {
    name: string;
    images: string[];
  };
  variantSku: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  recipientName: string;
}

interface OrderData {
  _id: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

const OrderDetailPage = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const getOrder = async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const res = await getOrderById(String(params?.id));
      setOrderData(res);
    } catch (error) {
      console.log("Error fetching order detail: ", error);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getOrder();
    }
  }, [params?.id]);

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    return status === "paid"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-orange-100 text-orange-800 border-orange-300";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons: Record<OrderStatus, React.ReactNode> = {
      pending: <Clock className="w-5 h-5" />,
      processing: <Package className="w-5 h-5" />,
      shipped: <Truck className="w-5 h-5" />,
      delivered: <CheckCircle className="w-5 h-5" />,
      cancelled: <XCircle className="w-5 h-5" />,
    };
    return icons[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy thông tin đơn hàng.
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Chi tiết đơn hàng
              </h1>
              <p className="text-slate-600 mt-1">
                Mã đơn: #{orderData._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge
                className={`${getStatusColor(
                  orderData.status
                )} px-4 py-2 text-sm font-semibold border hover:bg-white`}
              >
                <span className="flex items-center gap-2">
                  {getStatusIcon(orderData.status)}
                  {orderData.status === "pending"
                    ? "Chờ xử lý"
                    : orderData.status === "processing"
                    ? "Đang xử lý"
                    : orderData.status === "shipped"
                    ? "Đang giao"
                    : orderData.status === "delivered"
                    ? "Đã giao"
                    : "Đã hủy"}
                </span>
              </Badge>
              <Badge
                className={`${getPaymentStatusColor(
                  orderData.paymentStatus
                )} px-4 py-2 text-sm font-semibold border hover:bg-white`}
              >
                {orderData.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-slate-600 text-sm">
            Đặt hàng lúc: {formatDate(orderData.createdAt)}
          </p>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Sản phẩm đã đặt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md border border-slate-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          SKU: {item.variantSku}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Số lượng: {item.quantity}
                          </span>
                          <span className="font-bold text-lg text-slate-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {orderData.shippingAddress.recipientName}
                      </p>
                      <p className="text-sm text-slate-600">Người nhận</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-900">
                      {orderData.shippingAddress.street}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      {orderData.shippingAddress.state},{" "}
                      {orderData.shippingAddress.city}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {orderData.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-900">
                    {orderData.user.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-900 text-sm">
                    {orderData.user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-900">{orderData.user.phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">
                    {orderData.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : orderData.paymentMethod === "bank"
                      ? "Chuyển khoản ngân hàng"
                      : "Ví điện tử"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(orderData.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {formatCurrency(orderData.total)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
