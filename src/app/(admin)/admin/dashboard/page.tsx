"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getReport } from "@/services/report";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardOverview() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const loadData = async () => {
    setLoading(true);
    try {
      const params =
        startDate && endDate
          ? {
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
            }
          : {};

      const res = await getReport(params);
      setReport(res?.data);
    } catch (error) {
      console.error("❌ Load report error:", error);
    } finally {
      setLoading(false);
    }
  };

   const handleFilter = async () => {
     setLoading(true);
     try {
       const params =
         startDate && endDate
           ? {
               startDate: format(startDate, "yyyy-MM-dd"),
               endDate: format(endDate, "yyyy-MM-dd"),
             }
           : undefined;

       const res = await getReport(params);
       setReport(res?.data);
     } catch (error) {
       console.error("❌ Load report error:", error);
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;
  if (!report)
    return <div className="p-6 text-red-500">Không có dữ liệu báo cáo</div>;

  const { revenue, orderStatus, topProducts, customerStats, paymentMethods } =
    report;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          📊 Báo cáo tổng quan
        </h1>

        {/* Bộ lọc ngày */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy") : "Từ ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate ?? undefined}
                onSelect={(date) => {
                  if (endDate && date && date > endDate) return; // không cho chọn > endDate
                  setStartDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Đến ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate ?? undefined}
                onSelect={(date) => {
                  if (startDate && date && date < startDate) return; // không cho chọn < startDate
                  setEndDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleFilter} disabled={loading}>
            {loading ? "Đang tải..." : "Lọc"}
          </Button>
        </div>
      </div>

      {/* === KPI Cards === */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>💰 Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">
              {revenue.totalRevenue.toLocaleString()} ₫
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧾 Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{revenue.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 Giá trị TB / đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {revenue.averageOrderValue.toLocaleString()} ₫
            </p>
          </CardContent>
        </Card>
      </div>

      {/* === Biểu đồ trạng thái đơn hàng === */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Trạng thái đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: orderStatus.map((s: any) => s.status),
              datasets: [
                {
                  label: "Tổng giá trị (₫)",
                  data: orderStatus.map((s: any) => s.totalValue),
                  backgroundColor: "rgba(37, 99, 235, 0.6)",
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </CardContent>
      </Card>

      {/* === Top sản phẩm bán chạy === */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2 text-right">Số lượng</th>
                  <th className="p-2 text-right">Doanh thu (₫)</th>
                  <th className="p-2 text-right">Số đơn</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p: any) => (
                  <tr key={p.productId} className="border-t">
                    <td className="p-2">{p.productName}</td>
                    <td className="p-2 text-right">{p.totalQuantity}</td>
                    <td className="p-2 text-right text-green-600">
                      {p.totalRevenue.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">{p.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* === Khách hàng & Thanh toán === */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>👥 Thống kê khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: ["Khách vãng lai", "Đăng ký", "Khách quay lại"],
                datasets: [
                  {
                    data: [
                      customerStats.guestOrders,
                      customerStats.registeredOrders,
                      customerStats.repeatCustomers,
                    ],
                    backgroundColor: [
                      "rgba(59,130,246,0.7)",
                      "rgba(16,185,129,0.7)",
                      "rgba(249,115,22,0.7)",
                    ],
                  },
                ],
              }}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💳 Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut
              data={{
                labels: paymentMethods.map((p: any) =>
                  p.paymentMethod.toUpperCase()
                ),
                datasets: [
                  {
                    data: paymentMethods.map((p: any) => p.totalValue),
                    backgroundColor: [
                      "rgba(139,92,246,0.7)",
                      "rgba(244,63,94,0.7)",
                    ],
                  },
                ],
              }}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
