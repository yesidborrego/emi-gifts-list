"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAuthForm } from "@/components/Login/Molecules/AdminAuthForm";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { fetchLogin, fetchRegister } from "@/services/apiAuth.service";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function LoginAdminPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthStore();

  const handleLogin = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchLogin(data);

      if (response?.status === 200) {
        const { user, token } = response.data;
        const session = { access_token: token, user };
        signIn(user, session);
        toast.success("Inicio de sesión exitoso", { duration: 3000 });
        router.replace("/admin");
        return;
      }
      if (response?.status === 422) {
        toast.error("Credenciales incorrectas", {
          duration: 3000,
        });
        return;
      }
      throw new Error(response?.message || "Error al iniciar sesión");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError("");
      data.password_confirmation = data.password_confirmation;
      const response = await fetchRegister(data);

      if (response?.status === 201) {
        toast.success(
          "Usuario creado. Un administrador debe activar su cuenta.",
          { duration: 5000 }
        );
        return true;
      } else {
        throw new Error(response?.message || "Error en el registro");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en el registro";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <AdminAuthForm
          isLoading={isLoading}
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={error}
        />
      </div>
    </div>
  );
}
