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
import { useGiftStore } from "@/hooks/use-gift-store";

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
  const { productos, store } = useGiftStore();
  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: "",
    descripcion: "",
  });

  const isEditing = Boolean(productId);
  const producto = productos.find((p) => p.id === productId);

  useEffect(() => {
    if (isEditing && producto) {
      setFormData({
        nombre: producto.nombre,
        cantidad: producto.cantidad.toString(),
        descripcion: producto.descripcion || "",
      });
    }
  }, [isEditing, producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.cantidad.trim()) {
      toast.error("El nombre y la cantidad son obligatorios", {
        duration: 3000,
      });
      return;
    }

    const cantidad = Number.parseInt(formData.cantidad);
    if (isNaN(cantidad) || cantidad < 0) {
      toast.error("La cantidad debe ser un número válido mayor o igual a 0", {
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && productId) {
        store.actualizarProducto(productId, {
          nombre: formData.nombre.trim(),
          cantidad,
          descripcion: formData.descripcion.trim() || undefined,
        });

        toast.success("El producto ha sido actualizado correctamente.", {
          duration: 3000,
        });
      } else {
        store.crearProducto(
          formData.nombre.trim(),
          cantidad,
          formData.descripcion.trim() || undefined
        );

        toast.success("El producto ha sido creado correctamente.", {
          duration: 3000,
        });
      }

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto",
        { duration: 3000 }
      );
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
            <Label htmlFor="nombre">Nombre del producto *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej: Smartphone Samsung Galaxy"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad disponible *</Label>
            <Input
              id="cantidad"
              type="number"
              min="0"
              placeholder="Ej: 5"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cantidad: e.target.value }))
              }
              className="h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción del producto..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
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
