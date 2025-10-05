"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const menuItems = [
  { href: "/user/profile", label: "Thông tin cá nhân", icon: User },
  { href: "/user/orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
  { href: "/user/wishlist", label: "Sản phẩm yêu thích", icon: Heart },
  { href: "/user/history", label: "Lịch sử xem", icon: History },
  { href: "/user/settings", label: "Cài đặt tài khoản", icon: Settings },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, initializeAuth, isInitialized } =
    useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isInitialized) {
        await initializeAuth();
      }

      if (!isAuthenticated) {
        router.push("/");
      }
    };

    checkAuth();
  }, [isAuthenticated, isInitialized, initializeAuth, router]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto mt-[160px] flex gap-8 pb-20">
      <aside className="w-[260px] bg-card border rounded-2xl shadow-sm p-5 h-fit">
        <h2 className="text-lg font-semibold mb-4">Tài khoản của tôi</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl mt-3"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </nav>
      </aside>

      {/* --- Main content --- */}
      <main className="flex-1 bg-background rounded-2xl border p-6 shadow-sm">
        {children}
      </main>
    </div>
  );
}
