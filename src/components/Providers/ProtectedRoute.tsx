// components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
