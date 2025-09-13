"use client";
import InputWithIcon from "@/components/CustomInput/InputWithIcon";
import CustomTable from "@/components/CustomTable";
import DialogCategory from "@/components/Dialog/DialogCategory";
import { Button } from "@/components/ui/button";
import { ACTION } from "@/constants/action";
import useLoadingStore from "@/hooks/useLoading";
import { IBrandResponse } from "@/interface/brands.interface";
import { IApiParams } from "@/interface/shared/api";
import { getAllCategories } from "@/services/categories";
import { debounce } from "lodash";
import { Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>(ACTION.ADD);
  const [categoryId, setCategoryId] = React.useState<string>("");

  const [brands, setBrands] = React.useState<IBrandResponse>();
  const [search, setSearch] = React.useState<string>("");
  const [pageSize, setPageSize] = React.useState<number>(10);
  const { stopLoading, loading, startLoading } = useLoadingStore();
  const router = useRouter();

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
        header: "Tên danh mục",
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
          cellClassName: "py-5 w-[30.5%] ",
        },
      },
      {
        header: "Cấp độ",
        id: "level",
        accessorKey: "level",
        meta: {
          cellClassName: "py-5 w-[15%] text-center",
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
      // {
      //   header: "",
      //   id: "_action",
      //   accessorKey: "_action",
      //   cell: ({ row }: any) => {
      //     return <Trash2 size={18} color="red" />;
      //   },
      //   meta: {
      //     cellClassName: "py-5 w-[15%] text-center",
      //     disableRowClick: true,
      //   },
      // },
    ],
    [JSON.stringify(brands)]
  );

  const getCategories = async (pageIndex: number) => {
    startLoading();
    const params: IApiParams = {
      limit: pageSize,
      index: pageIndex,
      order: "createdDate",
      sort: "asc",
      keyword: search,
    };
    try {
      const response = await getAllCategories(params);

      setBrands(response?.data);
    } catch (error) {
      console.error("Error fetching brands: ", error);
    } finally {
      stopLoading();
    }
  };

  const handleRowClick = (row: any) => {
    setOpen(true);
    setCategoryId(row._id);
  };

  React.useEffect(() => {
    getCategories(1);
  }, [pageSize, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-5">
        <h3 className="font-bold text-xl uppercase">Danh mục sản phẩm</h3>

        <div className="flex items-center justify-end gap-5">
          <InputWithIcon
            Icon={Search}
            placeholder="Tìm kiếm theo tên"
            className="w-[35%]"
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }, 1000)}
          />
          <Button
            onClick={() => {
              setOpen(true);
              setCategoryId("");
            }}
          >
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
          onChangePage={(pageIndex) => getCategories(pageIndex)}
          onChangePageSize={(pageSize) => setPageSize(pageSize)}
          onRowClick={(row) => handleRowClick(row)}
        />
      </div>

      {open && type && (
        <DialogCategory
          open={open}
          setOpen={setOpen}
          type={type}
          id={categoryId}
          reload={getCategories}
          setType={setType}
        />
      )}
    </div>
  );
}
