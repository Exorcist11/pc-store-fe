"use client";

import InputWithIcon from "@/components/CustomInput/InputWithIcon";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import useLoadingStore from "@/hooks/useLoading";
import { IOrderResponse } from "@/interface/order.interface";
import { IApiParams } from "@/interface/shared/api";
import { getAllOrders } from "@/services/orders";
import { debounce } from "lodash";
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  PackageCheck,
  Plus,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { JSX } from "react";

export default function page() {
  const [search, setSearch] = React.useState<string>("");
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [order, setOrder] = React.useState<IOrderResponse>();
  const { stopLoading, loading, startLoading } = useLoadingStore();
  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/admin/orders/${row._id}`);
  };

  const columns: any[] = React.useMemo(
    () => [
      {
        header: "No.",
        id: "no",
        cell: ({ row }: any) => {
          const pageIndex = order?.index || 1;
          const pageSize = order?.limit || 10;
          return (pageIndex - 1) * pageSize + row.index + 1;
        },
        meta: {
          cellClassName: "py-5 w-[5%] text-center",
        },
      },
      {
        header: "Khách hàng",
        id: "customer",
        cell: ({ row }: any) => {
          const original = row?.original;
          if (original.isGuest) {
            return `${original.guestInfo?.firstName || ""} ${
              original.guestInfo?.lastName || ""
            }`;
          }

          // ✅ Chỉ render thuộc tính cần thiết, không render cả object
          return (
            original.user?.fullName || original.user?.username || "Unknown"
          );
        },
        meta: {
          cellClassName: "py-5 w-[15%]",
        },
      },
      {
        header: "Email",
        id: "email",
        cell: ({ row }: any) => {
          return row?.original?.guestInfo?.email || "-";
        },
        meta: {
          cellClassName: "py-5 w-[15%]",
        },
      },

      {
        header: "Tổng tiền",
        id: "total",
        cell: ({ row }: any) => {
          const total = row?.original?.total || 0;
          return total.toLocaleString("vi-VN") + " ₫";
        },
        meta: {
          cellClassName: "py-5 w-[10%] text-right",
        },
      },
      {
        header: "Trạng thái",
        id: "status",
        cell: ({ row }: any) => {
          const status = row?.original?.status;
          const config: Record<
            string,
            { label: string; color: string; icon: JSX.Element }
          > = {
            pending: {
              label: "Chờ xử lý",
              color: "bg-yellow-100 text-yellow-800",
              icon: <Clock size={14} className="mr-1" />,
            },
            processing: {
              label: "Đang xử lý",
              color: "bg-indigo-100 text-indigo-800",
              icon: <Clock size={14} className="mr-1" />,
            },
            shipped: {
              label: "Đang giao",
              color: "bg-purple-100 text-purple-800",
              icon: <Truck size={14} className="mr-1" />,
            },
            delivered: {
              label: "Đã giao",
              color: "bg-green-100 text-green-800",
              icon: <PackageCheck size={14} className="mr-1" />,
            },
            cancelled: {
              label: "Đã hủy",
              color: "bg-red-100 text-red-800",
              icon: <XCircle size={14} className="mr-1" />,
            },
          };

          const { label, color, icon } = config[status] || {
            label: "Không xác định",
            color: "bg-gray-100 text-gray-800",
            icon: <HelpCircle size={14} className="mr-1" />,
          };

          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
            >
              {icon} {label}
            </span>
          );
        },
        meta: {
          cellClassName: "py-5 w-[12%] text-center",
        },
      },

      {
        header: "Thanh toán",
        id: "payment",
        cell: ({ row }: any) => {
          const { paymentStatus, paymentMethod } = row?.original;

          const config: Record<
            string,
            { label: string; color: string; icon: JSX.Element }
          > = {
            paid: {
              label: "Đã thanh toán",
              color: "bg-green-100 text-green-800",
              icon: <CheckCircle2 size={14} className="mr-1" />,
            },
            unpaid: {
              label: "Chưa thanh toán",
              color: "bg-red-100 text-red-800",
              icon: <XCircle size={14} className="mr-1" />,
            },
          };

          const { label, color, icon } = config[paymentStatus] || {
            label: "Không rõ",
            color: "bg-gray-100 text-gray-800",
            icon: <HelpCircle size={14} className="mr-1" />,
          };

          return (
            <div className="flex flex-col items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
              >
                {icon} {label}
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                {paymentMethod.toUpperCase()}
              </span>
            </div>
          );
        },
        meta: {
          cellClassName: "py-5 w-[15%] text-center",
        },
      },

      {
        header: "Ngày đặt",
        id: "createdAt",
        cell: ({ row }: any) => {
          return new Date(row?.original?.createdAt).toLocaleString("vi-VN");
        },
        meta: {
          cellClassName: "py-5 w-[10%] text-center",
        },
      },
    ],
    [JSON.stringify(order)]
  );

  const getOrder = async (pageIndex: number) => {
    startLoading();
    const params: IApiParams = {
      limit: pageSize,
      index: pageIndex,
      order: "desc",
      sort: "createdAt",
      keyword: search,
    };
    try {
      const response = await getAllOrders(params);

      setOrder(response?.data);
    } catch (error) {
      console.error("Error fetching brands: ", error);
    } finally {
      stopLoading();
    }
  };

  React.useEffect(() => {
    getOrder(1);
  }, [pageSize, search]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-5">
        <h3 className="font-bold text-xl uppercase">Danh sách đơn hàng</h3>

        <div className="flex items-center justify-end gap-5">
          <InputWithIcon
            Icon={Search}
            placeholder="Tìm kiếm"
            className="w-[35%]"
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }, 1000)}
          />
          {/* <Button onClick={() => {}}>
            <Plus color="#fff" /> Thêm mới
          </Button> */}
        </div>
      </div>

      <div className="flex gap-2 flex-col">
        <CustomTable
          columns={columns}
          data={order?.items || []}
          isLoading={loading}
          wrapperClassName="2xl:max-h-[78vh]  xl:max-h-[72vh]"
          pageIndex={order?.index || 1}
          pageSize={order?.limit || pageSize}
          totalCount={order?.total || 0}
          onChangePage={(pageIndex) => getOrder(pageIndex)}
          onChangePageSize={(pageSize) => setPageSize(pageSize)}
          onRowClick={(row) => handleRowClick(row)}
        />
      </div>
    </div>
  );
}
