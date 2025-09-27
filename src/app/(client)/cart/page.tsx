"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSumary";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCartByUserId } from "@/services/cart";
import { useEffect, useState } from "react";
import { calculateDiscountedPrice } from "@/utils/formatPrice";
import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export type CartItemForm = {
  id: string;
  qty: number;
  selected: boolean;
  productId: string;
  variantSku: string;
  name: string;
  imageUrl: string;
  specs: {
    label: string;
  }[];
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  stock: number;
};

export type CartFormValues = {
  items: CartItemForm[];
};

export default function Cart() {
  const [loading, setLoading] = useState<boolean>(false);
  const { control, handleSubmit, reset } = useForm<CartFormValues>({
    defaultValues: {},
  });
  const router = useRouter();
  const { user } = useAuthStore();

  const { setItems, items: cartItems, clearCart } = useCartStore();

  const { fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ control, name: "items" });

  const subtotal =
    items
      ?.filter((item) => item.selected)
      .reduce(
        (sum, item) =>
          sum +
          calculateDiscountedPrice(item.currentPrice, item.discountPercent) *
            item.qty,
        0
      ) || 0;

  const onSubmit = (data: CartFormValues) => {
    const selectedItem = data.items.filter((item) => item.selected);

    setItems(
      selectedItem.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantSku: item.variantSku,
        imageUrl: item.imageUrl,
        specs: item.specs,
        discountPercent: item.discountPercent,
        qty: item.qty,
        name: item.name,
        price: item.originalPrice,
      }))
    );

    router.push("/payment");
  };

  const getCart = async () => {
    setLoading(true);
    try {
      if (user) {
        const response = await getCartByUserId(user._id ?? "");

        const mappedItems = response.items.map((item: any) => {
          const variant = item.product.variants.find(
            (v: any) => v.sku === item.variantSku
          );

          return {
            id: item._id,
            qty: item.quantity,
            selected: false,
            productId: item.product._id,
            variantSku: item.variantSku,
            name: item.product.name,
            imageUrl: variant?.images[0] || item.product.images[0],
            specs: Object.entries(variant?.attributes || {}).map(
              ([label, value]) => ({
                label: `${label}: ${value}`,
              })
            ),
            originalPrice: variant?.price,
            currentPrice: item.priceAtAdd,
            discountPercent: item.product.discount,
            stock: variant.stock,
          };
        });

        reset({ items: mappedItems });
      }
    } catch (error) {
      console.error("Error fetching cart: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, [user?._id]);

  return (
    <LoadingWrapper isLoading={loading}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container flex gap-6 mx-auto mt-[160px]"
      >
        <div className="flex flex-col gap-5 w-full">
          <h2 className="text-[28px] font-bold">Giỏ hàng của bạn</h2>

          <div className="grid grid-cols-9 gap-6">
            <div className="col-span-6">
              {fields.length > 0 && (
                <Card>
                  <CardHeader>
                    <p className="text-xl font-semibold">
                      Sản phẩm trong giỏ hàng
                    </p>
                  </CardHeader>

                  <div className="px-6 pb-5">
                    <Separator />
                  </div>
                  {fields.map((field, index) => (
                    <CardContent key={field.id}>
                      <CartItem
                        id={field.id}
                        variant={field.variantSku}
                        name={field.name}
                        imageUrl={field.imageUrl}
                        specs={field.specs}
                        originalPrice={field.originalPrice}
                        currentPrice={field.currentPrice}
                        discountPercent={field.discountPercent}
                        control={control}
                        index={index}
                        onRemove={() => remove(index)}
                        stock={field.stock}
                      />

                      <Separator />
                    </CardContent>
                  ))}
                </Card>
              )}
            </div>

            <div className="col-span-3 min-h-full">
              <div className="sticky top-36">
                <CartSummary
                  totalItems={items?.filter((i) => i.selected).length}
                  subtotal={subtotal}
                  shippingFee="free"
                  total={subtotal}
                  onCheckout={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </LoadingWrapper>
  );
}
