"use client";

import LoadingWrapper from "@/components/Loading/LoadingWrapper";
import PaymentForm from "@/components/Payment/PaymentForm";
import PaymentSummary from "@/components/Payment/PaymentSummary";
import { Form } from "@/components/ui/form";
import { errorFunc } from "@/lib/errorFunc";
import { PaymentFormData, paymentSchema } from "@/lib/schema";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import toastifyUtils from "@/utils/toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Payment() {
  const router = useRouter()
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
  const { user } = useAuthStore();

  const onSubmit = async (data: PaymentFormData) => {
    const payload = {
      userId: user?._id || "",
      isGuest: data.isGuest,
      guestInfo: {
        email: data.guestInfo.email,
        firstName: data.guestInfo.firstName,
        lastName: data.guestInfo.lastName,
        phone: data.guestInfo.phone,
      },
      items: data.items.map((item) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: Number(item.quantity),
      })),
      shippingAddress: {
        street: data.shippingAddress.stress,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        country: "Việt Nam",
        phone: data.shippingAddress.phone,
        recipientName: data.guestInfo.firstName + " " + data.guestInfo.lastName,
      },
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    };

    try {
      console.log("Payload send API:", payload);
      const response = await axiosInstance({
        method: "POST",
        url: `${URL_PATHS.ORDERS}`,
        data: payload,
      });
      toastifyUtils("success", "Tạo mới đơn hàng thành công!");
      form.reset();
      router.push("/")
    } catch (error) {
      console.error("Error create order");
      toastifyUtils("error", "Tạo mới đơn hàng thất bại!");
    }
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
