"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { AdminCredentialsInputs } from "../Atoms/AdminCredentialsInputs";

interface AdminAuthFormProps {
  onLogin: (data: { email: string; password: string }) => Promise<void> | void;
  onRegister: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<boolean>;
  error?: string;
}

export function AdminAuthForm({
  onLogin,
  onRegister,
  error,
}: AdminAuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError("");

    if (isRegister) {
      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        setLocalError("Por favor, completa todos los campos.");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Las contraseñas no coinciden.");
        setIsLoading(false);
        return;
      }
      const success = await onRegister({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        password_confirmation: confirmPassword.trim(),
      });
      if (success) {
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setIsLoading(false);
        return;
      }
      await onLogin({ email: email.trim(), password: password.trim() });
    }
    // setIsLoading(false);
  };

  return (
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
          {isRegister ? "Registro de Administrador" : "Acceso de Administrador"}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
          )}
          <AdminCredentialsInputs
            emailValue={email}
            onEmailChange={(e) => setEmail(e.target.value)}
            passwordValue={password}
            onPasswordChange={(e) => setPassword(e.target.value)}
            confirmPasswordValue={confirmPassword}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            isLoading={isLoading}
            isRegister={isRegister}
          />

          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/50 p-4">
            <div className="space-y-1">
              <Label
                htmlFor="auth-mode"
                className="text-sm font-medium text-card-foreground"
              >
                {isRegister
                  ? "¿Ya tienes cuenta? Inicia Sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </Label>
            </div>
            <Switch
              id="auth-mode"
              checked={isRegister}
              onCheckedChange={setIsRegister}
              disabled={isLoading}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {(error || localError) && (
            <Alert variant="destructive" className="animate-pulse">
              <AlertDescription className="text-sm">
                {localError || error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="h-12 w-full transform text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              (isRegister &&
                (!name.trim() ||
                  !email.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim())) ||
              (!isRegister && (!email.trim() || !password.trim())) ||
              isLoading
            }
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {isRegister ? "Registrando..." : "Ingresando..."}
              </div>
            ) : isRegister ? (
              "Registrar"
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
