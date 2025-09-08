import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import LoadingTable from "../LoadingTable";
import { getDate, getMonth, getYear } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CustomTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: any) => void;
  showPagination?: boolean;
  isLoading?: boolean;
  textCenter?: boolean;
  tableHeaderClass?: string;
  wrapperClassName?: string;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onChangePageSize?: (pageSize: number) => void;
  onChangePage?: (page: number) => void;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    disableRowClick?: boolean;
  }
}

const CustomTable = <TData, TValue>(props: CustomTableProps<TData, TValue>) => {
  const {
    columns,
    data,
    isLoading,
    textCenter = false,
    tableHeaderClass,
    wrapperClassName,
    onRowClick,
    pageIndex = 1,
    pageSize = 10,
    totalCount = 0,
    onChangePage,
    onChangePageSize,
  } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const totalPages = Math.ceil(totalCount / pageSize);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      FilterNumber: (
        row: Row<TData>,
        columnId: string,
        filterValue: string
      ): boolean => {
        const cellValue = row.getValue(columnId);
        return cellValue === filterValue;
      },
      FilterString: (
        row: Row<TData>,
        columnId: string,
        filterValue: string
      ): boolean => {
        const cellValue = row.getValue(columnId) as string;
        return cellValue
          .toLowerCase()
          .trim()
          .includes(filterValue.toLowerCase())
          ? true
          : false;
      },
      FilteArrayString: (
        row: Row<any>,
        columnId: string,
        filterValue: string
      ): boolean => {
        return JSON.stringify(
          row.original.optionResults.map((item: any) =>
            item.result.toLowerCase()
          )
        ).includes(filterValue.toLowerCase())
          ? true
          : false;
      },
      FilterDate: (
        row: Row<TData>,
        columnId: string,
        filterValue: string
      ): boolean => {
        const cellValue = row.getValue(columnId) as string;
        const filterDate = new Date(filterValue);
        const cellDate = new Date(cellValue);
        const areEqual =
          getYear(filterDate) === getYear(cellDate) &&
          getMonth(filterDate) === getMonth(cellDate) &&
          getDate(filterDate) === getDate(cellDate);
        return areEqual;
      },
    },
  });

  return (
    <div className="flex gap-3 flex-col">
      <div className="w-full overflow-x-auto hide-scrollbar">
        <Table
          wrapperClassName={cn(
            "border rounded-lg max-h-[70vh]",
            wrapperClassName
          )}
        >
          <TableHeader
            className={cn(
              "sticky top-0 h-16 z-10 bg-[#fafafa] ",
              tableHeaderClass
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        textCenter
                          ? "text-brownColor text-center px-6"
                          : "text-brownColor px-6 font-bold",
                        header.column.columnDef.meta?.headerClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <LoadingTable />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    (row.original as { isHightLight?: boolean })?.isHightLight
                      ? "animate-highlight-row"
                      : ""
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        className={cn(
                          textCenter ? "text-center px-6 py-3" : "px-6 py-3",
                          !!onRowClick ? "cursor-pointer" : "",
                          cell.column.columnDef.meta?.cellClassName
                        )}
                        onClick={() => {
                          if (
                            !cell.column.columnDef.meta?.disableRowClick &&
                            onRowClick
                          ) {
                            onRowClick(row.original);
                          }
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && (
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap">Rows per page:</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                onChangePageSize?.(Number(value));
              }}
            >
              <SelectTrigger className="w-[65px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {(pageIndex - 1) * pageSize + 1}-
              {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
            </span>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label="Go to previous page"
                    size="icon"
                    variant="ghost"
                    disabled={pageIndex == 1}
                    onClick={() => onChangePage?.(Math.max(pageIndex - 1, 1))}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    aria-label="Go to next page"
                    size="icon"
                    variant="ghost"
                    disabled={pageIndex >= totalPages}
                    onClick={() =>
                      onChangePage?.(Math.min(pageIndex + 1, totalPages))
                    }
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CustomTable);
