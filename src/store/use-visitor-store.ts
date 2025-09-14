import { create } from "zustand";
import { Visitor } from "@/interfaces/visitor.interface";
import { getVisitors } from "@/services/apiVisitors.service";

interface VisitorState {
  visitors: Visitor[];
  loading: boolean;
  error: string | null;
  fetchVisitors: () => Promise<void>;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  visitors: [],
  loading: false,
  error: null,
  fetchVisitors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getVisitors();
      if (response.status === 200) {
        set({ visitors: response.data, loading: false });
      } else {
        set({ loading: false, error: response.message });
      }
    } catch (error) {
      console.error({ error });
      set({ loading: false, error: "Error fetching visitors" });
    }
  },
}));
