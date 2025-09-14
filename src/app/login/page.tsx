"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/Login/Molecules/LoginForm";
import { toast } from "react-hot-toast";
import { useGuestStore } from "@/store/use-guest-store";
import {
  searchVisitorsByName,
  storeVisitor,
} from "@/services/apiVisitors.service";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { setGuestName, setVisitorId } = useGuestStore();

  const handleLogin = async (data: { nombre: string }) => {
    try {
      setError("");
      const { nombre } = data;

      const { data: visitors, status } = await searchVisitorsByName(nombre);

      if (status === 200) {
        if (visitors && visitors.length > 0) {
          const errorMessage =
            "Este nombre ya ha sido tomado, por favor elige otro.";
          setError(errorMessage);
          toast.error(errorMessage, { duration: 3000 });
          return;
        }

        const response = await storeVisitor(nombre);
        if (response.status === 201 && response.data) {
          setVisitorId(response.data.id);
          setGuestName(nombre);
          toast.success(`Bienvenida(o), ${nombre}`, { duration: 3000 });
          router.push("/regalos");
        } else {
          const errorMessage =
            "Error al guardar el visitante. Por favor, intenta nuevamente.";
          setError(errorMessage);
          toast.error(errorMessage, { duration: 3000 });
        }
        return;
      }
      if (status === 409) {
        const errorMessage = "Esta persona ya ingresó al sitio anteriormente.";
        setError(errorMessage);
        toast.error(errorMessage, { duration: 3000 });
        return;
      }
      const errorMessage = "Error al validar el nombre de usuario.";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="slide-in-up mb-4 text-center">
          <div className="pulse-glow mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-8 w-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Lista de Regalos
          </h1>
          <p className="text-balance text-muted-foreground">
            Bienvenido a nuestra plataforma de gestión de regalos
          </p>
        </div>

        <LoginForm onLogin={handleLogin} error={error} />

        <div
          className="slide-in-up mt-8 text-center"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-sm text-muted-foreground">
            Ingresa tu nombre para comenzar a seleccionar regalos
          </p>
        </div>
      </div>
    </div>
  );
}
