import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";

const NavbarCustom = () => {
  return (
    <div className="bg-muted fixed top-0 z-10 inset-x-0 ">
      <nav className="h-16 bg-darkBurgundy border-b-2 border-highlight ">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto p-4 ">
          <div className="flex items-center gap-8">
            <Link href="/" className="cursor-pointer">
              <Logo />
            </Link>
            {/* Desktop Menu */}
            <NavMenu className="hidden laptop:block" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex hover:bg-highlight"
            >
              Đăng nhập
            </Button>
            <Button className="bg-highlight hover:bg-textInverse hover:shadow-sm text-text">
              Đăng ký
            </Button>
            {/* <Button size="icon" variant="outline">
              <SunIcon />
            </Button> */}
            {/* Mobile Menu */}
            <div className="laptop:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarCustom;
