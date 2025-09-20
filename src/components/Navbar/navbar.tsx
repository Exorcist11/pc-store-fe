import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import { Input } from "../ui/input";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

const NavbarCustom = () => {
  const router = useRouter();
  return (
    <div className="bg-muted fixed top-0 z-10 inset-x-0 ">
      <div className="flex items-center py-4 justify-between mx-auto max-w-screen-xl">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <div className="flex border rounded-lg">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            className="border-none min-w-96  focus-visible:ring-transparent"
          />
          <Button className="bg-brandeisBlue text-white hover:opacity-90">
            <Search />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => router.push("/login")}
          >
            <UserRound />
            Đăng nhập
          </Button>
          <Button
            variant="ghost"
            className=""
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart />
            Giỏ hàng
          </Button>

          <div className="laptop:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>

      <nav className="h-16 bg-brandeisBlue border-b-2 hidden laptop:block">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto py-4 ">
          <div className="flex items-center gap-8">
            <NavMenu />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarCustom;
