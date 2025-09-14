import { Visitor } from "@/interfaces/visitor.interface";
import { Product } from "@/lib/types";

const URLBACK = process.env.NEXT_PUBLIC_URL_BACK || "";

export const getVisitors = async (): Promise<{
  status: number;
  data: Visitor[];
  message: string | null;
}> => {
  try {
    const response = await fetch(`${URLBACK}visitors`);

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
      message: "¡Error al mostrar los visitantes!",
    };
  } catch (error) {
    return {
      status: 500,
      data: [],
      message: `¡Error al mostrar los visitantes! - ${error}`,
    };
  }
};

export const searchVisitorsByName = async (
  name: string
): Promise<{
  status: number;
  data: Visitor[];
  message: string | null;
}> => {
  try {
    const formData = new FormData();
    formData.append("name", name);

    const response = await fetch(`${URLBACK}visitors/search`, {
      method: "POST",
      body: formData,
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
      message: "¡Error al mostrar los visitantes!",
    };
  } catch (error) {
    return {
      status: 500,
      data: [],
      message: `¡Error al mostrar los visitantes! - ${error}`,
    };
  }
};

export const storeVisitor = async (
  name: string
): Promise<{
  status: number;
  data: Visitor | null;
  message: string | null;
}> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    const response = await fetch(`${URLBACK}visitors`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      return {
        status: response.status,
        data: data.data || null,
        message: null,
      };
    }

    return {
      status: response.status,
      data: null,
      message: "¡Error al mostrar los visitantes!",
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: `¡Error al mostrar los visitantes! - ${error}`,
    };
  }
};

export const registerProductsVisitor = async (
  visitorId: string,
  products: Product[]
) => {
  try {
    const formattedProducts = {
      products: products.map((p) => ({
        product_id: p.id,
        amount: p.amount,
      })),
    };

    const response = await fetch(`${URLBACK}visitors/${visitorId}/products`, {
      method: "POST",
      body: JSON.stringify(formattedProducts),
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
      message: "¡Error al registrar los productos!",
    };
  } catch (error) {
    return {
      status: 500,
      data: [],
      message: `¡Error al registrar los productos! - ${error}`,
    };
  }
};
