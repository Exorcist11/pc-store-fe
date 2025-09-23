// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GetCurrentUser } from "@/services/account";

interface User {
  id?: string;
  email?: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  signIn: (data: any) => Promise<boolean>;
  signOut: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null, // Không persist user
      isLoading: false,
      isInitialized: false,
      isAuthenticated: false,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),

      signIn: async (data: any) => {
        set({ isLoading: true });

        try {
          // Lưu token vào localStorage và store
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          set({ token: data.token });

          // Gọi API get current user
          const responseUserInfo = await GetCurrentUser();

          if (responseUserInfo) {
            set({
              user: responseUserInfo,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          localStorage.clear();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      signOut: () => {
        localStorage.clear();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      // store/authStore.ts
      initializeAuth: async () => {
        const currentState = get();

        if (currentState.isInitialized) return;

        set({ isLoading: true });

        // Debug localStorage
        const token = localStorage.getItem("token");

        if (token) {
          set({ token });

          try {
            const responseUserInfo = await GetCurrentUser();

            if (responseUserInfo) {
              set({
                user: responseUserInfo,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
              });
              return;
            } else {
              console.log("⚠️ API returned but no data field");
            }
          } catch (error) {
            
            localStorage.clear();
          }
        } else {
          console.log("No token found in localStorage");
        }

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      // CHỈ persist token, không persist user
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);
