"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { VisitorNameInput } from "../Atoms/VisitorNameInput";
import InvitationModal from "@/components/Login/Atoms/InvitationModal";

interface LoginFormProps {
  onLogin: (data: { nombre: string }) => Promise<void> | void;
  error?: string;
}

export function LoginForm({ onLogin, error }: LoginFormProps) {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return;
    }

    setIsLoading(true);
    await onLogin({ nombre: nombre.trim() });
    setIsLoading(false);
  };

  return (
    <>
      <InvitationModal />
      <Card
        className="slide-in-up border-0 bg-card/95 shadow-2xl backdrop-blur-sm"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Image
              src="/logo-emi.png"
              alt="Emiliana"
              width={200}
              height={60}
              className="logo-entrance object-contain"
              priority
            />
          </div>
          <h2 className="text-center text-2xl font-semibold text-card-foreground">
            Iniciar Sesión
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <VisitorNameInput
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              isLoading={isLoading}
            />

            {error && (
              <Alert variant="destructive" className="animate-pulse">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="h-12 w-full transform text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!nombre.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Ingresando...
                </div>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
