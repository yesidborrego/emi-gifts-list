"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/Login/Molecules/LoginForm";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { useGuestStore } from "@/store/use-guest-store";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { signIn, session } = useAuthStore();
  const { setGuestName } = useGuestStore();

  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
  }, [session, router]);

  const handleLogin = (
    data: { email: string; password: string } | { nombre: string },
    esAdmin: boolean
  ) => {
    try {
      setError("");
      if (esAdmin) {
        const { email, password } = data as {
          email: string;
          password: string;
        };
        signIn(email, password);

        toast.success("Inicio de sesión exitoso", { duration: 3000 });
      } else {
        const { nombre } = data as { nombre: string };
        setGuestName(nombre);
        router.push("/regalos");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 slide-in-up">
          <div className="inline-flex items-center justify-center h-16 bg-primary rounded-full w-16 mb-2 pulse-glow">
            <svg
              className="w-8 h-8 text-primary-foreground"
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lista de Regalos
          </h1>
          <p className="text-muted-foreground text-balance">
            Bienvenido a nuestra plataforma de gestión de regalos
          </p>
        </div>

        <LoginForm onLogin={handleLogin} error={error} />

        <div
          className="mt-8 text-center slide-in-up"
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
