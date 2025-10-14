import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Cpu,
  DribbbleIcon,
  GithubIcon,
  Inbox,
  Locate,
  Phone,
  TwitchIcon,
  TwitterIcon,
  Webhook,
} from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Danh mục sản phẩm",
    links: [
      {
        title: "Laptop",
        href: "#",
      },
      {
        title: "PC - Máy tính để bàn",
        href: "#",
      },
      {
        title: "Linh kiện máy tính",
        href: "#",
      },
      {
        title: "Màn hình",
        href: "#",
      },
      {
        title: "Phụ kiện",
        href: "#",
      },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      {
        title: "Hướng dẫn đặt hàng",
        href: "#",
      },
      {
        title: "Hướng dẫn thanh toán",
        href: "#",
      },
      {
        title: "Chính sách đổi trả",
        href: "#",
      },
      {
        title: "Chính sách vận chuyển",
        href: "#",
      },
    ],
  },
  {
    title: "Về chúng tôi",
    links: [
      {
        title: "Giới thiệu",
        href: "#",
      },
      {
        title: "Liên hệ",
        href: "#",
      },
      {
        title: "Dịch vụ",
        href: "#",
      },
      {
        title: "Tuyển dụng",
        href: "#",
      },
    ],
  },
];

const Footer03Page = () => {
  return (
    <div className="flex flex-col bg-white">
      <div className="grow" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 grid grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-4 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full laptop:col-span-1 ">
              {/* Logo */}
              <Cpu className="h-8 w-8 mr-2" color="blue" />

              <div className="mt-4 text-muted-foreground flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="uppercase font-bold text-2xl">
                    <span className="text-brandeisBlue">PC</span>{" "}
                    <span className="text-black">Store</span>
                  </h2>
                  <Separator className="h-0.5 w-16 bg-brandeisBlue" />
                </div>
                <p className="text-sm text-justify">
                  Chúng tôi là đơn vị tin cậy chuyên cung cấp các sản phẩm máy
                  tính, linh kiện và phụ kiện công nghệ chính hãng với giá tốt
                  nhất
                </p>
                {/* <div className="flex text-sm items-center gap-2">
                  <Locate size={16} /> Số nhà ...
                </div>
                <div className="flex text-sm items-center gap-2">
                  <Webhook size={16} /> Số nhà ...
                </div>
                <div className="flex text-sm items-center gap-2">
                  <Phone size={16} /> Số nhà ...
                </div>
                <div className="flex text-sm items-center gap-2">
                  <Inbox size={16} /> Số nhà ...
                </div> */}
              </div>
            </div>

            {footerSections.map(({ title, links }) => (
              <div key={title} className="col-span-full tablet:col-span-1">
                <h6 className="font-semibold">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title} className="text-sm ">
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-brandeisBlue"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Subscribe Newsletter */}
            {/* <div className="col-span-2">
              <h6 className="font-semibold">Đăng ký nhận thông tin</h6>
              <form className="mt-6 flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="grow max-w-64"
                />
                <Button>Đăng ký</Button>
              </form>
            </div> */}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                PC Store
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer03Page;
