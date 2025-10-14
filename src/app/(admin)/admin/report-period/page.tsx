"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getReportByPeriod } from "@/services/report";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportPeriod() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Khi component mount, set 7 ngày gần nhất
  useEffect(() => {
    const today = new Date();
    setEndDate(today);
    setStartDate(subDays(today, 6)); // 7 ngày = từ hôm nay trừ 6 ngày
    loadReport(subDays(today, 6), today, period);
  }, []);

  const loadReport = async (
    start: Date = startDate!,
    end: Date = endDate!,
    periodValue: "day" | "week" | "month" = period
  ) => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const params = {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
        period: periodValue,
      };
      const res = await getReportByPeriod(params);
      setReportData(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📊 Báo cáo doanh thu</h1>

      {/* Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select
          value={period}
          onValueChange={(value) => {
            setPeriod(value as "day" | "week" | "month");
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chọn khoảng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Ngày</SelectItem>
            <SelectItem value="week">Tuần</SelectItem>
            <SelectItem value="month">Tháng</SelectItem>
          </SelectContent>
        </Select>

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
                  if (endDate && date && date > endDate) return;
                  setStartDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

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
                  if (startDate && date && date < startDate) return;
                  setEndDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={() => loadReport()} disabled={loading}>
            {loading ? "Đang tải..." : "Lọc"}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p>Đang tải dữ liệu...</p>}

      {/* Line Chart */}
      {!loading && reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu & Số đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels: reportData.map((r) =>
                  period === "day"
                    ? `${r.year}-${r.month}-${r.day}`
                    : period === "week"
                    ? `Tuần ${r.week || r.period?.week} - ${r.year}`
                    : `${r.year}-${r.month}`
                ),
                datasets: [
                  {
                    label: "Doanh thu (₫)",
                    data: reportData.map((r) => r.revenue),
                    borderColor: "rgba(37, 99, 235, 0.8)",
                    backgroundColor: "rgba(37, 99, 235, 0.4)",
                    tension: 0.3,
                  },
                  {
                    label: "Số đơn",
                    data: reportData.map((r) => r.orders),
                    borderColor: "rgba(16, 185, 129, 0.8)",
                    backgroundColor: "rgba(16, 185, 129, 0.4)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </CardContent>
        </Card>
      )}

      {!loading && reportData.length === 0 && (
        <p>Chưa có dữ liệu cho khoảng thời gian này</p>
      )}
    </div>
  );
}
