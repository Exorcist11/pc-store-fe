"use client";

import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import PaymentForm from "@/components/Payment/PaymentForm";
import PaymentSummary from "@/components/Payment/PaymentSummary";
import { Form } from "@/components/ui/form";
import { errorFunc } from "@/lib/errorFunc";
import { PaymentFormData, paymentSchema } from "@/lib/schema";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Payment() {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      userId: "",
      isGuest: true,
      shippingAddress: {
        stress: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        recipientName: "",
      },
      guestInfo: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      },
      paymentMethod: "cod",
      items: [],
      notes: "",
    },
  });
  const items = useCartStore((state) => state.items);

  const onSubmit = async (data: PaymentFormData) => {
    console.log(data);
  };
  useEffect(() => {
    if (items.length > 0) {
      form.setValue(
        "items",
        items.map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          quantity: i.qty.toString(),
          price: i.price,
          image: i.imageUrl,
          name: i.name,
          discountPercent: i.discountPercent,
        }))
      );
    }
  }, [items, form]);
  return (
    <LoadingWrapper isLoading={false}>
      <Form {...form}>
        <form
          className="container flex gap-6 mx-auto mt-[160px]"
          onSubmit={form.handleSubmit(onSubmit, errorFunc)}
        >
          <div className="grid grid-cols-9 gap-6 w-full">
            <div className="col-span-6">
              <PaymentForm form={form} />
            </div>

            <div className="col-span-3">
              <div className="sticky top-36">
                <PaymentSummary form={form} />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </LoadingWrapper>
  );
}
