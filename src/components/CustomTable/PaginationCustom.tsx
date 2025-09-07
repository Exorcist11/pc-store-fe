"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import React from "react";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onChangePage: (pageIndex: number) => void;
  onChangePageSize?: (pageSize: number) => void;
}

export default function TablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onChangePage,
  onChangePageSize,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  return (
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
                onClick={() => onChangePage(Math.max(pageIndex - 1, 1))}
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
                  onChangePage(Math.min(pageIndex + 1, totalPages))
                }
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
