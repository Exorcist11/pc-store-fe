// hooks/useAuth.ts
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    signIn: store.signIn,
    signOut: store.signOut,
  };
};
