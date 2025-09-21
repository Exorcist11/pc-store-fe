import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  CreditCard,
  Landmark,
  NotebookPen,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import { PaymentFormData } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { getProvinces } from "@/services/province";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface IPaymentForm {
  form: UseFormReturn<PaymentFormData>;
}

interface Province {
  label: string;
  value: string;
}

export default function PaymentForm(props: IPaymentForm) {
  const paymentOptions = [
    {
      value: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      desc: "Bạn chỉ phải thanh toán khi nhận được hàng",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      value: "bank",
      label: "Chuyển khoản ngân hàng",
      desc: "Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi",
      icon: <Landmark className="w-6 h-6" />,
    },
    {
      value: "momo",
      label: "Ví MoMo",
      desc: "Thanh toán nhanh chóng qua ví điện tử MoMo",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      value: "credit",
      label: "Thẻ tín dụng/ghi nợ",
      desc: "Thanh toán an toàn bằng thẻ Visa, MasterCard",
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];
  const { form } = props;
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<Province[]>([]);

  const provice = form.watch("shippingAddress.city");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then((data) =>
        setProvinces(
          data.map((i: any) => ({
            label: i.name,
            value: i.code.toString(),
          }))
        )
      );
  }, []);

  useEffect(() => {
    if (provice) {
      fetch(`https://provinces.open-api.vn/api/v2/p/${provice}?depth=2`)
        .then((res) => res.json())
        .then((data) =>
          setDistricts(
            data.wards.map((i: any) => ({
              label: i.name,
              value: i.code.toString(),
            }))
          )
        );
    }
  }, [provice, form]);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-semibold text-xl">
            <Truck color="blue" /> Thông tin giao hàng
          </h3>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="guestInfo.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestInfo.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="guestInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="guestInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shippingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phường/Xã <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="shippingAddress.stress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Địa chỉ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-semibold text-xl">
            <CreditCard color="blue" /> Phương thức thanh toán
          </h3>
        </CardHeader>

        <CardContent>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-4"
                >
                  {paymentOptions.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`cursor-pointer rounded-2xl border-2 p-4 flex gap-4 items-center transition ${
                        field.value === opt.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="hidden" />
                      <div className="flex items-center justify-center w-10 h-10 text-blue-600">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-sm text-gray-500">{opt.desc}</div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-semibold text-xl">
            <NotebookPen color="blue" /> Ghi chú đơn hàng
          </h3>
        </CardHeader>

        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú cho người bán (tuỳ chọn) </FormLabel>
                <FormControl>
                  <Textarea placeholder="Ghi chú về đơn hàng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
