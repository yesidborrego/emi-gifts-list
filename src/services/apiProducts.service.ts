import { useAuthStore } from "@/store/use-auth-store";
import { Product } from "@/lib/types";
const URLBACK = process.env.NEXT_PUBLIC_URL_BACK || "";

const getAuthHeaders = () => {
  const session = useAuthStore.getState().session;
  if (!session) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${URLBACK}products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      return {
        status: response.status,
        data: data.data || [],
        message: null,
      };
    }

    return {
      status: response.status,
      data: [],
      message: "¡Error al mostrar las ideas!",
    };
  } catch (error) {
    return {
      status: 500,
      data: [],
      message: `¡Error al mostrar los usuarios! - ${error}`,
    };
  }
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("No hay sesión activa");
    const response = await fetch(`${URLBACK}products`, {
      method: "POST",
      headers,
      body: JSON.stringify(product),
    });
    if (response.ok) {
      const data = await response.json();
      return { status: response.status, data: data.data, message: null };
    }
    return {
      status: response.status,
      data: null,
      message: "Error al crear el producto",
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: `Error al crear el producto - ${error}`,
    };
  }
};

export const updateProduct = async (
  productId: string,
  product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("No hay sesión activa");
    const response = await fetch(`${URLBACK}products/${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(product),
    });
    if (response.ok) {
      const data = await response.json();
      return { status: response.status, data: data.data, message: null };
    }
    return {
      status: response.status,
      data: null,
      message: "Error al actualizar el producto",
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: `Error al actualizar el producto - ${error}`,
    };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("No hay sesión activa");
    const response = await fetch(`${URLBACK}products/${productId}`, {
      method: "DELETE",
      headers,
    });
    if (response.ok) {
      return {
        status: response.status,
        data: null,
        message: "Producto eliminado",
      };
    }
    return {
      status: response.status,
      data: null,
      message: "Error al eliminar el producto",
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: `Error al eliminar el producto - ${error}`,
    };
  }
};
