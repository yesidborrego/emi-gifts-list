"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { VisitorNameInput } from "../Atoms/VisitorNameInput";
import { AdminCredentialsInputs } from "../Atoms/AdminCredentialsInputs";

interface LoginFormProps {
  onLogin: (
    data: { email: string; password: string } | { nombre: string },
    esAdmin: boolean
  ) => Promise<void> | void;
  // onGoogleSignIn: () => Promise<void>;
  // onGoogleSignUp: () => Promise<void>;
  error?: string;
}

export function LoginForm({
  onLogin,
  // onGoogleSignIn,
  // onGoogleSignUp,
  error,
}: LoginFormProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!esAdmin && !nombre.trim()) {
      return;
    }
    if (esAdmin && (!email.trim() || !password.trim())) {
      return;
    }

    setIsLoading(true);
    if (esAdmin) {
      await onLogin(
        { email: email.trim(), password: password.trim() },
        esAdmin
      );
    } else {
      await onLogin({ nombre: nombre.trim() }, esAdmin);
    }
    setIsLoading(false);
  };

  return (
    <Card
      className="slide-in-up shadow-2xl border-0 bg-card/95 backdrop-blur-sm"
      style={{ animationDelay: "0.1s" }}
    >
      <CardHeader className="space-y-1">
        <div className="flex justify-center">
          <Image
            src="/logo-emi.png"
            alt="Emiliana"
            width={200}
            height={60}
            className="object-contain logo-entrance"
            priority
          />
        </div>
        <h2 className="text-2xl font-semibold text-center text-card-foreground">
          Iniciar Sesión
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {esAdmin ? (
            <AdminCredentialsInputs
              emailValue={email}
              onEmailChange={(e) => setEmail(e.target.value)}
              passwordValue={password}
              onPasswordChange={(e) => setPassword(e.target.value)}
              isLoading={isLoading}
            />
          ) : (
            <VisitorNameInput
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              isLoading={isLoading}
            />
          )}

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="space-y-1">
              <Label
                htmlFor="admin-mode"
                className="text-sm font-medium text-card-foreground"
              >
                Modo Administrador
              </Label>
              <p className="text-xs text-muted-foreground">
                Acceso a gestión de productos
              </p>
            </div>
            <Switch
              id="admin-mode"
              checked={esAdmin}
              onCheckedChange={setEsAdmin}
              disabled={isLoading}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="animate-pulse">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              (!esAdmin && !nombre.trim()) ||
              (esAdmin && (!email.trim() || !password.trim())) ||
              isLoading
            }
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>

        {/*  <Separator className="my-8" />

        <Button
          type="button"
          variant="outline"
          onClick={onGoogleSignUp}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-background hover:bg-muted text-foreground transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Chrome className="w-5 h-5 mr-2" />
          Registrarse con Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-background hover:bg-muted text-foreground transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          <Chrome className="w-5 h-5 mr-2" />
          Iniciar sesión con Google
        </Button> */}
      </CardContent>
    </Card>
  );
}
