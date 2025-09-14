"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { useProductStore } from "@/store/use-product-store";
import {
  createProduct,
  updateProduct as apiUpdateProduct,
} from "@/services/apiProducts.service";

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({
  productId,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addProduct, updateProduct, products } = useProductStore();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
  });

  const isEditing = Boolean(productId);
  const producto = products.find((p) => p.id === productId);

  useEffect(() => {
    if (isEditing && producto) {
      setFormData({
        name: producto.name,
        amount: producto.amount.toString(),
        description: producto.description || "",
      });
    }
  }, [isEditing, producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.amount.trim()) {
      toast.error("El nombre y la cantidad son obligatorios", {
        duration: 3000,
      });
      return;
    }

    const amount = Number.parseInt(formData.amount);
    if (isNaN(amount) || amount < 0) {
      toast.error("La cantidad debe ser un número válido mayor o igual a 0", {
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && productId) {
        const response = await apiUpdateProduct(productId, {
          amount,
          description: formData.description.trim() || undefined,
          name: formData.name.trim(),
        });

        if (response.status === 200 && response.data) {
          updateProduct(response.data);
          toast.success("El producto ha sido actualizado correctamente.");
        } else {
          throw new Error(response.message || "Error al actualizar");
        }
      } else {
        const response = await createProduct({
          amount,
          description: formData.description.trim() || undefined,
          name: formData.name.trim(),
        });

        if (response.status === 201 && response.data) {
          addProduct(response.data);
          toast.success("El producto ha sido creado correctamente.");
        } else {
          throw new Error(response.message || "Error al crear el producto");
        }
      }

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error";
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="slide-in-up shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Smartphone Samsung Galaxy"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad disponible *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              placeholder="Ej: 5"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descripción del producto..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : isEditing ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
