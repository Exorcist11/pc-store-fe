// components/AuthProvider.tsx
"use client";
import SlashScreen from "@/components/SplashScreen";
import { useAuthStore } from "@/store/authStore";
import React from "react";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const { initializeAuth, isLoading, isInitialized } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Hiển thị splash screen khi đang loading hoặc chưa initialized
  if (!isInitialized || isLoading) {
    return <SlashScreen />;
  }

  return <>{children}</>;
};
