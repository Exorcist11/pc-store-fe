import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import { Input } from "../ui/input";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const NavbarCustom = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  return (
    <div className="bg-white fixed top-0 z-10 inset-x-0 ">
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
            className=""
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart />
            Giỏ hàng
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user?.fullName}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={() => router.push("/login")}
            >
              <UserRound />
              Đăng nhập
            </Button>
          )}
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
