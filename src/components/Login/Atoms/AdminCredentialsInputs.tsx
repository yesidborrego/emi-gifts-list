"use client";
import type React from "react";
import { Input } from "@/components/ui/input";

interface AdminCredentialsInputsProps {
  emailValue: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordValue: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function AdminCredentialsInputs({
  emailValue,
  onEmailChange,
  passwordValue,
  onPasswordChange,
  isLoading,
}: AdminCredentialsInputsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="Correo administrador"
          value={emailValue}
          onChange={onEmailChange}
          className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          type="password"
          placeholder="Contraseña administrador"
          value={passwordValue}
          onChange={onPasswordChange}
          className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
          required
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
