"use client";
import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface AdminCredentialsInputsProps {
  emailValue: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordValue: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  confirmPasswordValue?: string;
  onConfirmPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isRegister?: boolean;
}

export function AdminCredentialsInputs({
  emailValue,
  onEmailChange,
  passwordValue,
  onPasswordChange,
  confirmPasswordValue,
  onConfirmPasswordChange,
  isLoading,
  isRegister,
}: AdminCredentialsInputsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <div className="space-y-2 relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña administrador"
          value={passwordValue}
          onChange={onPasswordChange}
          className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {isRegister && (
        <div className="space-y-2 relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPasswordValue}
            onChange={onConfirmPasswordChange}
            className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            aria-label={
              showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
