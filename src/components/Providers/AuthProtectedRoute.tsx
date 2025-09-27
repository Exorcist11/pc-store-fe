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
      if (!isAuthenticated && pathname !== "/login") {
        // chưa login mà đi đâu khác login → đưa về login
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        // đã login mà vẫn ở login → đưa về /
        router.push("/");
      }
    }
  }, [isAuthenticated, isInitialized, isLoading, pathname, router]);

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu đang trong quá trình redirect thì không render gì
  if (
    (isAuthenticated && pathname === "/login") ||
    (!isAuthenticated && pathname !== "/login")
  ) {
    return null;
  }

  return <>{children}</>;
}
