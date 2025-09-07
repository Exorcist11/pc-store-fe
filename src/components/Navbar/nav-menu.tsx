"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavMenu = (props: NavigationMenuProps) => {
  const pathname = usePathname();
  const menus = [
    { path: "/", label: "Trang chủ" },
    { path: "/tin-tuc", label: "Tin tức" },
    { path: "/gioi-thieu", label: "Giới thiệu" },
    { path: "/dich-vu", label: "Dịch vụ" },
    { path: "/lien-he", label: "Liên hệ" },
  ];

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {menus.map((menu) => (
          <NavigationMenuItem key={menu.path}>
            <NavigationMenuLink asChild>
              <Link
                href={menu.path}
                className={cn(
                  "relative inline-block px-4 py-2 transition-all duration-200 cursor-pointer",
                  pathname === menu.path
                    ? "text-highlight laptop:font-bold desktop:font-bold"
                    : "text-textInverse",
                  "before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-highlight before:transition-all before:duration-300 hover:before:w-full"
                )}
              >
                {menu.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
