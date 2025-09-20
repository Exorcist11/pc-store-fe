"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSumary";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type CartFormValues = {
  items: {
    id: string;
    qty: number;
    selected: boolean;
  }[];
};

export default function Cart() {
  const { control, handleSubmit } = useForm<CartFormValues>({
    defaultValues: {
      items: [
        {
          id: "68c97fc056f3df66b9faa9b5",
          qty: 1,
          selected: true,
        },
      ],
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ control, name: "items" });

  const subtotal =
    items
      ?.filter((item) => item.selected)
      .reduce((sum, item) => sum + 15290000 * item.qty, 0) || 0;

  const onSubmit = (data: CartFormValues) => {
    console.log("Dữ liệu giỏ hàng:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container flex gap-6 mx-auto mt-[160px]"
    >
      <div className="flex flex-col gap-5 w-full">
        <h2 className="text-[28px] font-bold">Giỏ hàng của bạn</h2>

        <div className="grid grid-cols-9 gap-6">
          <div className="col-span-6">
            <Card>
              <CardHeader>
                <p className="text-xl font-semibold">Sản phẩm trong giỏ hàng</p>
              </CardHeader>

              <div className="px-6 pb-5">
                <Separator />
              </div>

              <CardContent>
                {fields.map((field, index) => (
                  <CartItem
                    key={field.id}
                    id={field.id}
                    variant="GS01"
                    name="PC CPS Gaming G01"
                    imageUrl="https://res.cloudinary.com/deyszirfc/image/upload/v1758035902/lebeaexzpumddfjzdxmj.webp"
                    specs={[
                      {
                        label: "Intel Core i3 12100F",
                      },
                      {
                        label: "16GB RAM",
                      },
                      {
                        label: "RX 6500 XT 4GB",
                      },
                      {
                        label: "MSI Pro H610M-S",
                      },
                    ]}
                    originalPrice={25483334}
                    currentPrice={15290000}
                    discountPercent={40}
                    control={control}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                ))}

                <Separator />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3">
            <CartSummary
              totalItems={items.filter((i) => i.selected).length}
              subtotal={subtotal}
              shippingFee="free"
              total={subtotal}
              onCheckout={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
