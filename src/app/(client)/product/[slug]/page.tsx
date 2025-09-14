"use client";

import FeaturedProducts from "@/components/Homepage/FeaturedProduct";
import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import ProductGallery from "@/components/Products/ProductGallery";
import ProductInfo from "@/components/Products/ProductInfo";
import {
  IProduct,
  IProductPublic,
  Variant,
} from "@/interface/product.interface";
import { getProductBySlug } from "@/services/products";
import toastifyUtils from "@/utils/toastify";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const [product, setProduct] = useState<IProductPublic | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllImgProducts = (product: IProductPublic) => {
    const mainImg = product.images || [];
    const varientImg = product.variants.flatMap((v) => v.images || []);
    const allImg = [...mainImg, ...varientImg];
    return allImg;
  };

  const params = useParams();

  const getDetailProductBySlug = async () => {
    setLoading(true);
    try {
      const response = await getProductBySlug(String(params?.slug));
      setProduct(response);
    } catch (error) {
      toastifyUtils("error", "Có lỗi xảy ra khi lấy chi tiết sản phẩm");
      console.log("Error fetching product detail by slug: ", error);
    } finally {
      setLoading(false);
    }
  };

  const findFirstInStockVariant = () => {
    return (
      product?.variants.find((variant: Variant) => variant.stock > 0) ||
      product?.variants[0]
    );
  };
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    undefined
  );

  useEffect(() => {
    const firstInStock = findFirstInStockVariant();
    if (firstInStock) {
      setSelectedVariant(firstInStock);
    }
  }, [product?.variants]);

  useEffect(() => {
    getDetailProductBySlug();
  }, [params?.slug]);
  return (
    <LoadingWrapper isLoading={loading}>
      <div className="container mx-auto grid md:grid-cols-2 gap-8 mt-[160px]">
        <ProductGallery
          images={product ? getAllImgProducts(product) : []}
          selectedVariant={selectedVariant}
        />
        {product && (
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        )}

        <div className="col-span-2">
          <FeaturedProducts />
        </div>
      </div>
    </LoadingWrapper>
  );
}
