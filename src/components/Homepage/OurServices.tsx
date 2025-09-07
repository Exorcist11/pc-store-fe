import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    category: "Vận chuyển hành khách",
    title: "Hành trình an toàn, thoải mái",
    details:
      "Cung cấp dịch vụ vận chuyển hành khách với xe hiện đại, tiện nghi và tài xế chuyên nghiệp. Đảm bảo đúng giờ, an toàn và giá cả hợp lý.",
    tutorialLink: "#",
  },
  {
    category: "Vận chuyển hàng hóa",
    title: "Giao hàng nhanh chóng, an toàn",
    details:
      "Dịch vụ vận chuyển hàng hóa đa dạng từ nhỏ lẻ đến số lượng lớn. Cam kết giao hàng đúng hẹn, bảo quản cẩn thận và giá cả cạnh tranh.",
    tutorialLink: "#",
  },
  {
    category: "Thuê xe du lịch",
    title: "Trải nghiệm du lịch tiện lợi",
    details:
      "Cung cấp dịch vụ cho thuê xe du lịch từ 4 đến 45 chỗ, có tài xế hoặc tự lái. Xe đời mới, giá hợp lý, phù hợp cho cá nhân, gia đình và doanh nghiệp.",
    tutorialLink: "#",
  },

  {
    category: "Hợp đồng vận tải",
    title: "Giải pháp vận tải linh hoạt",
    details:
      "Cung cấp dịch vụ hợp đồng vận tải dài hạn cho cá nhân, doanh nghiệp. Đáp ứng nhu cầu vận chuyển theo yêu cầu với chi phí tối ưu.",
    tutorialLink: "#",
  },
];

const OurService = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-screen-xl mx-auto w-full py-10 px-6">
        <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-xl md:text-center md:mx-auto">
          Dịch vụ của chúng tôi
        </h2>
        <div className="mt-8 md:mt-16 w-full mx-auto space-y-20">
          {features.map((feature) => (
            <div
              key={feature.category}
              className="flex flex-col md:flex-row items-center gap-x-20 gap-y-6 md:odd:flex-row-reverse"
            >
              <div className="w-full aspect-[6/4] bg-muted rounded-xl border border-border/50 basis-1/2" />
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-semibold text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-3xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-[17px]">
                  {feature.details}
                </p>
                <Button
                  asChild
                  className="mt-6 rounded-full min-w-40 text-[15px]"
                >
                  <Link href={feature.tutorialLink}>
                    Xem chi tiết
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurService;
