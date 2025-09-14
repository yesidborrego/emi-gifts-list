import { useAuthStore } from "@/store/use-auth-store";

const URLBACK = process.env.NEXT_PUBLIC_URL_BACK || "";

const getAuthHeaders = () => {
  const session = useAuthStore.getState().session;
  if (!session) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
};

export const fetchLogin = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const data = await fetch(URLBACK + "login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });

    return {
      status: data.status,
      data: data.data ? data.data : null,
      message: data.message,
    };
  } catch (error) {
    console.error(error);
  }
};

export const fetchRegister = async (values: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const data = await fetch(URLBACK + "register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });

    return {
      status: data.status,
      data: data.data ? data.data : null,
      message: data.message,
    };
  } catch (error) {
    console.error(error);
  }
};

export const fetchLogout = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("No hay sesión activa");
    const data = await fetch(URLBACK + "logout", {
      method: "POST",
      headers,
    }).then((response) => {
      return response.json();
    });

    return {
      status: data.status,
      data: data.data ? data.data : null,
      message: data.message,
    };
  } catch (error) {
    console.error(error);
  }
};
