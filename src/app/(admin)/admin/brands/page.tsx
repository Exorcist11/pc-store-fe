"use client";
import InputWithIcon from "@/components/CustomInput/InputWithIcon";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import useLoadingStore from "@/hooks/useLoading";
import { IBrandResponse } from "@/interface/brands.interface";
import { IApiParams } from "@/interface/shared/api";
import { getAllBrands } from "@/services/brand";
import { debounce } from "lodash";
import { Plus, Search } from "lucide-react";
import React from "react";

export default function page() {
  const [brands, setBrands] = React.useState<IBrandResponse>();
  const [search, setSearch] = React.useState<string>("");
  const [pageSize, setPageSize] = React.useState<number>(10);
  const { stopLoading, loading, startLoading } = useLoadingStore();

  const columns: any[] = React.useMemo(
    () => [
      {
        header: "No.",
        id: "no",
        cell: ({ row }: any) => {
          const pageIndex = brands?.index || 1;
          const pageSize = brands?.limit || 10;
          return (pageIndex - 1) * pageSize + row.index + 1;
        },
        meta: {
          cellClassName: "py-5 w-[5%]",
        },
      },
      {
        header: "Tên thương hiệu",
        id: "name",
        accessorKey: "name",
        cell: ({ row }: any) => {
          return row?.original?.name;
        },
        meta: {
          cellClassName: "py-5 w-[37.5%] ",
        },
      },
      {
        header: "Slug",
        id: "slug",
        accessorKey: "slug",
        cell: ({ row }: any) => {
          return row?.original?.slug;
        },
        meta: {
          cellClassName: "py-5 w-[37.5%] ",
        },
      },

      {
        header: "Trạng thái",
        id: "isActive",
        accessorKey: "isActive",
        cell: ({ row }: any) => {
          const isActive = row?.original?.isActive;
          return (
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isActive ? "Active" : "InActive"}
            </span>
          );
        },
        meta: {
          cellClassName: "py-5 w-[15%] text-center",
        },
      },
    ],
    [JSON.stringify(brands)]
  );

  const getBrand = async (pageIndex: number) => {
    startLoading();
    const params: IApiParams = {
      limit: pageSize,
      index: pageIndex,
      order: "licensePlate",
      sort: "asc",
      keyword: search,
    };
    try {
      const response = await getAllBrands(params);
      setBrands(response?.data);
    } catch (error) {
      console.error("Error fetching cars: ", error);
    } finally {
      stopLoading();
    }
  };

  React.useEffect(() => {
    getBrand(1);
  }, [pageSize, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-5">
        <h3 className="font-bold text-xl uppercase">Danh sách thương hiệu</h3>

        <div className="flex items-center justify-end gap-5">
          <InputWithIcon
            Icon={Search}
            placeholder="Tìm kiếm theo tên"
            className="w-[35%]"
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }, 1000)}
          />
          <Button>
            <Plus color="#fff" /> Thêm mới
          </Button>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <CustomTable
          columns={columns}
          data={brands?.items || []}
          isLoading={loading}
          wrapperClassName="2xl:max-h-[78vh]  xl:max-h-[72vh]"
          pageIndex={brands?.index || 1}
          pageSize={brands?.limit || pageSize}
          totalCount={brands?.total || 0}
          onChangePage={(pageIndex) => getBrand(pageIndex)}
          onChangePageSize={(pageSize) => setPageSize(pageSize)}
        />
      </div>
    </div>
  );
}
