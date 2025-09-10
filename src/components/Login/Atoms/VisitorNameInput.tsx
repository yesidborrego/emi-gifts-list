"use client";
import type React from "react";
import { Input } from "@/components/ui/input";

interface VisitorNameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function VisitorNameInput({
  value,
  onChange,
  isLoading,
}: VisitorNameInputProps) {
  return (
    <div className="space-y-2">
      <Input
        id="nombre"
        type="text"
        placeholder="Ingresa tu nombre completo"
        value={value}
        onChange={onChange}
        className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
        required
        disabled={isLoading}
      />
    </div>
  );
}
