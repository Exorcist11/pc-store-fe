import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, Map, Ticket } from "lucide-react";

export default function StepBuyTicket() {
  const steps = [
    {
      id: 1,
      title: "Chọn Chuyến Xe Phù Hợp",
      description:
        "Truy cập website hoặc liên hệ tổng đài, chọn điểm đi, điểm đến, ngày giờ khởi hành theo nhu cầu.",
      icon: <Map size={30} color="green" />,
    },
    {
      id: 2,
      title: "Đặt Vé & Thanh Toán",
      description:
        "Nhập thông tin cá nhân, chọn ghế ngồi yêu thích và thanh toán dễ dàng qua nhiều hình thức.",
      icon: <Ticket size={30} color="green" />,
    },
    {
      id: 3,
      title: " Nhận Vé & Lên Xe",
      description:
        "Xác nhận vé qua tin nhắn/email, đến điểm đón đúng giờ và tận hưởng hành trình thoải mái cùng chúng tôi!",
      icon: <Bus size={30} color="green" />,
    },
  ];

  return (
    <div className="px-5 flex flex-col gap-5 mb-10 max-w-screen-xl mx-auto mt-10">
      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-3xl laptop:text-4xl text-center">
          Mua vé của bạn chỉ với 3 bước!
        </h3>
        <p className="text-base text-center text-mediumGray">
          Khám phá những lý do tuyệt vời để chọn nhà xe của chúng tôi! Chỉ cần
          đặt vé, lên xe và tận hưởng chuyến đi trọn vẹn!
        </p>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="grid gap-5 grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className={
                steps.length % 2 === 1 && index === steps.length - 1
                  ? "tablet:col-span-2 laptop:col-span-1"
                  : ""
              }
            >
              <CardContent className="flex flex-col gap-2 justify-center p-6 items-center text-center">
                <div className="rounded-full h-[80px] w-[80px] bg-[#0E9E4D40] flex items-center justify-center relative">
                  {step.icon}
                  <p className="absolute -right-2 -top-2 p-1 bg-green-700 rounded-full text-white w-8 h-8 flex items-center justify-center text-sm">
                    {step.id}
                  </p>
                </div>
                <h4 className="font-bold text-xl">{step.title}</h4>
                <p className="text-mediumGray">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
