"use client";

import InputWithIcon from "@/components/CustomInput/InputWithIcon";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import useLoadingStore from "@/hooks/useLoading";
import { IApiParams } from "@/interface/shared/api";
import { IUserResponse } from "@/interface/user.interface";
import { getAllUsers } from "@/services/users";
import { debounce } from "lodash";
import { Plus, Search } from "lucide-react";
import React from "react";

export default function page() {
  const [search, setSearch] = React.useState<string>("");
  const { stopLoading, loading, startLoading } = useLoadingStore();
  const [users, setUsers] = React.useState<IUserResponse>();
  const [pageSize, setPageSize] = React.useState<number>(10);

  const columns: any[] = React.useMemo(
    () => [
      {
        header: "No.",
        id: "no",
        cell: ({ row }: any) => {
          const pageIndex = users?.index || 1;
          const pageSize = users?.limit || 10;
          return (pageIndex - 1) * pageSize + row.index + 1;
        },
        meta: {
          cellClassName: "py-5 w-[5%]",
        },
      },
      {
        header: "Email",
        id: "email",
        accessorKey: "email",
        cell: ({ row }: any) => {
          return row?.original?.email;
        },
        meta: {
          cellClassName: "py-5 w-[37.5%] ",
        },
      },
      {
        header: "Fullname",
        id: "fullName",
        accessorKey: "fullName",
        cell: ({ row }: any) => {
          return row?.original?.fullName;
        },
        meta: {
          cellClassName: "py-5 w-[30.5%] ",
        },
      },
      {
        header: "Số điện thoại",
        id: "phone",
        accessorKey: "phone",
        meta: {
          cellClassName: "py-5 w-[15%] text-left",
        },
      },
      {
        header: "Role",
        id: "role",
        accessorKey: "role",
        cell: ({ row }: any) => {
          const role = row?.original?.role;

          const roleConfig: Record<string, { label: string; color: string }> = {
            admin: { label: "Admin", color: "bg-red-500" },
            staff: { label: "Staff", color: "bg-blue-500" },
            customer: { label: "Customer", color: "bg-green-500" },
          };

          const { label, color } = roleConfig[role] || {
            label: "Unknown",
            color: "bg-gray-400",
          };

          return (
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${color}`}
            >
              {label}
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
    [JSON.stringify(users)]
  );

  const getUsers = async (pageIndex: number) => {
    startLoading();
    const params: IApiParams = {
      limit: pageSize,
      index: pageIndex,
      order: "createdDate",
      sort: "asc",
      keyword: search,
    };
    try {
      const response = await getAllUsers(params);

      setUsers(response?.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      stopLoading();
    }
  };

  React.useEffect(() => {
    getUsers(1);
  }, [pageSize, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-5">
        <h3 className="font-bold text-xl uppercase">Danh sách tài khoản</h3>

        <div className="flex items-center justify-end gap-5">
          <InputWithIcon
            Icon={Search}
            placeholder="Tìm kiếm"
            className="w-[35%]"
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }, 1000)}
          />
          <Button onClick={() => {}}>
            <Plus color="#fff" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-col">
        <CustomTable
          columns={columns}
          data={users?.items || []}
          isLoading={loading}
          wrapperClassName="2xl:max-h-[78vh]  xl:max-h-[72vh]"
          pageIndex={users?.index || 1}
          pageSize={users?.limit || pageSize}
          totalCount={users?.total || 0}
          onChangePage={(pageIndex) => getUsers(pageIndex)}
          onChangePageSize={(pageSize) => setPageSize(pageSize)}
          //   onRowClick={(row) => handleRowClick(row)}
        />
      </div>
    </div>
  );
}
