"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isInitialized, isLoading, pathname, router]);

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  // chỉ block khi đã login mà vẫn đứng ở trang login
  if (isAuthenticated && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
