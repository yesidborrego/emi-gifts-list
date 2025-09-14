import { create } from "zustand";
import { Product } from "@/lib/types";
import {
  getProducts,
  deleteProduct as apiDeleteProduct,
} from "@/services/apiProducts.service";

interface ProductState {
  products: Product[];
  selectedProducts: Product[];
  isLoading: boolean;
  initializeProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  setSelectedProducts: (products: Product[]) => void;
  clearSelectedProducts: () => void;
  updateSelectedProductAmount: (productId: string, amount: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProducts: [],
  isLoading: false,
  initializeProducts: async () => {
    if (get().products.length > 0 || get().isLoading) {
      return;
    }
    set({ isLoading: true });
    try {
      const { data, status } = await getProducts();
      if (status === 200 && data) {
        set({ products: data });
      } else {
        set({ products: [] });
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      set({ products: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  setProducts: (products) => set({ products }),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  clearSelectedProducts: () => set({ selectedProducts: [] }),
  updateSelectedProductAmount: (productId, amount) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.map((p) =>
        p.id === productId ? { ...p, amount } : p
      ),
    })),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  deleteProduct: async (productId: string) => {
    const { status, message } = await apiDeleteProduct(productId);
    if (status >= 200 && status < 300) {
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      }));
    } else {
      throw new Error(message ?? "Error al eliminar el producto");
    }
  },
}));
