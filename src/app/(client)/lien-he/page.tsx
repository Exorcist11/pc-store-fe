import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";

const Contact02Page = () => (
  <div className="container flex gap-6 mx-auto mt-[160px]">
    <div className="w-full max-w-(--breakpoint-xl) mx-auto px-6 xl:px-0">
      <b className="text-muted-foreground uppercase font-semibold text-sm">
        Liên hệ
      </b>
      <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
        Nói chuyện với đội ngũ thân thiện của chúng tôi!
      </h2>
      <p className="mt-3 text-base sm:text-lg text-muted-foreground">
        Chúng tôi rất vui khi nhận được phản hồi từ bạn. Hãy điền form bên dưới
        hoặc gửi email cho chúng tôi.
      </p>
      <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
        {/* Thông tin liên hệ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          <div>
            <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
              <MailIcon />
            </div>
            <h3 className="mt-6 font-semibold text-xl">Email</h3>
            <p className="my-2.5 text-muted-foreground">
              Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ.
            </p>
            <Link
              className="font-medium text-primary"
              href="mailto:support@pcstore.com"
            >
              support@pcstore.com
            </Link>
          </div>
          <div>
            <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
              <MessageCircle />
            </div>
            <h3 className="mt-6 font-semibold text-xl">Chat trực tiếp</h3>
            <p className="my-2.5 text-muted-foreground">
              Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ.
            </p>
            <Link className="font-medium text-primary" href="#">
              Bắt đầu chat mới
            </Link>
          </div>
          <div>
            <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
              <MapPinIcon />
            </div>
            <h3 className="mt-6 font-semibold text-xl">Văn phòng</h3>
            <p className="my-2.5 text-muted-foreground">
              Hãy ghé thăm văn phòng của chúng tôi.
            </p>
            <Link
              className="font-medium text-primary"
              href="https://map.google.com"
              target="_blank"
            >
              {/* 100 Đường Smith, Collingwood <br /> VIC 3066, Úc */}
            </Link>
          </div>
          <div>
            <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
              <PhoneIcon />
            </div>
            <h3 className="mt-6 font-semibold text-xl">Điện thoại</h3>
            <p className="my-2.5 text-muted-foreground">
              Thứ 2 - Thứ 6 từ 8h sáng đến 5h chiều.
            </p>
            <Link className="font-medium text-primary" href="tel:+15550000000">
              +1 (555) 000-0000
            </Link>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-accent shadow-none py-0">
          <CardContent className="p-6 md:p-8">
            <form>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    placeholder="Nhập họ"
                    id="firstName"
                    className="mt-2 bg-white h-10 shadow-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    placeholder="Nhập tên"
                    id="lastName"
                    className="mt-2 bg-white h-10 shadow-none"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="Nhập email"
                    id="email"
                    className="mt-2 bg-white h-10 shadow-none"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="message">Nội dung</Label>
                  <Textarea
                    id="message"
                    placeholder="Nhập nội dung liên hệ"
                    className="mt-2 bg-white shadow-none"
                    rows={6}
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Checkbox id="acceptTerms" className="bg-background" />
                  <Label htmlFor="acceptTerms" className="gap-0">
                    Bạn đồng ý với
                    <Link href="#" className="underline ml-1">
                      điều khoản và chính sách
                    </Link>
                    <span>.</span>
                  </Label>
                </div>
              </div>
              <Button className="mt-6 w-full" size="lg">
                Gửi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default Contact02Page;
