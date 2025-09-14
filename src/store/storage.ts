import type { PersistStorage, StorageValue } from "zustand/middleware";
import secureLocalStorage from "react-secure-storage";

export const secureStorage = <T>(): PersistStorage<T> => ({
  getItem: (name: string): StorageValue<T> | null => {
    try {
      const item = secureLocalStorage.getItem(name);

      if (item && typeof item === "object" && "state" in item) {
        return item as StorageValue<T>;
      }

      return null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<T>): void => {
    secureLocalStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    secureLocalStorage.removeItem(name);
  },
});
