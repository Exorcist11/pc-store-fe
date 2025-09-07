import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

interface LoadingState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const useLoadingStore = create<LoadingState>()(
  immer((set) => ({
    loading: false,
    setLoading: (value) =>
      set((state) => {
        state.loading = value;
      }),
    startLoading: () =>
      set((state) => {
        state.loading = true;
      }),
    stopLoading: () =>
      set((state) => {
        state.loading = false;
      }),
  }))
);

export default useLoadingStore;
