"use client";
import SidebarFilters from "@/components/Category/SidebarFilters";
import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import ProductCard from "@/components/Products/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProduct } from "@/interface/product.interface";
import { getPublicProductByCategorySlug } from "@/services/categories";
import toastifyUtils from "@/utils/toastify";
import { Grid, List, Package2, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProductByCategory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sort, setSort] = useState({
    sort: "createdAt",
    order: "desc",
  });
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSortChange = (value: string) => {
    switch (value) {
      case "price-asc":
        setSort({ sort: "price", order: "asc" });
        break;
      case "price-desc":
        setSort({ sort: "price", order: "desc" });
        break;
      case "createdAt":
      default:
        setSort({ sort: "createdAt", order: "desc" });
        break;
    }
  };

  const getProducts = async (sortOptions = sort) => {
    setLoading(true);
    try {
      const response = await getPublicProductByCategorySlug(
        String(params?.category),
        sortOptions
      );

      if (!response?.items) {
        setProducts([]);
        toastifyUtils("error", "Không tìm thấy danh mục hoặc sản phẩm");
        return;
      }

      setProducts(response?.items);
    } catch (error: any) {
      console.error("Error fetching products: ", error);

      toastifyUtils("error", "Có lỗi xảy ra, vui lòng thử lại sau");

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.category) {
      getProducts({ sort: "createdAt", order: "desc" });
    }
  }, [params?.category]);

  useEffect(() => {
    if (params?.category) getProducts();
  }, [sort]);
  return (
    <div className="container flex gap-6 mx-auto mt-[160px]">
      <SidebarFilters />

      {/* Products */}
      <LoadingWrapper
        isLoading={loading}
        overlay
        fullScreen
        text="Đang tải dữ liệu"
        size="md"
        className="w-full"
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>Sắp xếp theo:</span>
              <Select defaultValue="createdAt" onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="createdAt">Mới nhất</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant={view === "grid" ? "default" : "ghost"}
                onClick={() => setView("grid")}
              >
                <Grid />
              </Button>
              <Button
                size="icon"
                variant={view === "list" ? "default" : "ghost"}
                onClick={() => setView("list")}
              >
                <List />
              </Button>
            </div>
          </div>

          {products.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center col-span-3">
              <div className="mb-6">
                <Package2 size={80} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ
                lọc của bạn. Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc xóa bộ
                lọc để xem thêm sản phẩm.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    getProducts({ sort: "createdAt", order: "desc" });
                  }}
                  variant="outline"
                >
                  <RefreshCw
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </RefreshCw>
                  Xóa bộ lọc
                </Button>
                <Button
                  onClick={() => {
                    // Logic để xem tất cả sản phẩm
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  Xem tất cả sản phẩm
                </Button>
              </div>
            </div>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );
}
