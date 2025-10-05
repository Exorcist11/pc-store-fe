import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import { Input } from "../ui/input";
import {
  CircleUserRound,
  Heart,
  History,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { IProduct } from "@/interface/product.interface";
import { debounce } from "lodash";
import { getFeatureProduct } from "@/services/products";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const NavbarCustom = () => {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [results, setResults] = useState<IProduct[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const fetchSearchResult = debounce(async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await getFeatureProduct({
        keyword: encodeURIComponent(search),
      });
      setResults(res?.data?.items || []);
      setShowResults(true);
    } catch (error) {
      console.log("Search error", error);
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSearchResult(value);
  };

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className="bg-white fixed top-0 z-10 inset-x-0 ">
      <div className="flex items-center py-4 justify-between mx-auto max-w-screen-xl">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <div className="flex border rounded-lg relative">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            className="border-none min-w-96  focus-visible:ring-transparent"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowResults(true)}
          />
          <Button className="bg-brandeisBlue text-white hover:opacity-90">
            <Search />
          </Button>

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg border z-20 max-h-80 overflow-auto">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    router.push(`/product/${item.slug}`);
                    setShowResults(false);
                  }}
                >
                  <img
                    src={item.images[0] || "/no-image.jpg"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          )}
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
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 hover:bg-accent/60 rounded-full"
                >
                  <CircleUserRound size={28} />
                  <span className="hidden md:inline font-medium text-sm">
                    {user?.fullName || "Tài khoản"}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="text-sm font-semibold">
                  Xin chào, {user?.fullName?.split(" ")[0] || "bạn"}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/user/profile")}
                  >
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>Thông tin cá nhân</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/user/orders")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
                    <span>Đơn hàng của tôi</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/user/wishlist")}
                  >
                    <Heart className="mr-2 h-4 w-4 text-primary" />
                    <span>Sản phẩm yêu thích</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/user/history")}
                  >
                    <History className="mr-2 h-4 w-4 text-primary" />
                    <span>Lịch sử xem</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/user/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    <span>Cài đặt tài khoản</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
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
