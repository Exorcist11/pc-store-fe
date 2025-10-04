"use client";

import { useState, useEffect } from "react";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import debounce from "lodash.debounce";

const NavbarCustom = () => {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const fetchSearchResults = debounce(async (searchText: string) => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `/api/products?query=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      setResults(data?.items || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  }, 500); // delay 500ms

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSearchResults(value);
  };

  // Khi click ra ngoài thì ẩn kết quả
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white fixed top-0 z-10 inset-x-0 ">
      <div className="flex items-center py-4 justify-between mx-auto max-w-screen-xl relative">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        {/* SEARCH BAR */}
        <div className="flex border rounded-lg relative w-[400px]">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            className="border-none focus-visible:ring-transparent"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowResults(true)}
          />
          <Button className="bg-brandeisBlue text-white hover:opacity-90">
            <Search />
          </Button>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg border z-20 max-h-80 overflow-auto">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                    setShowResults(false);
                  }}
                >
                  <img
                    src={item.imageUrl || "/no-image.jpg"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/cart")}>
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
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
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

      {/* NAV MENU */}
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
