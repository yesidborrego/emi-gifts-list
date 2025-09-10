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
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/lib/supabase-functions";

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
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    description: "",
  });

  const isEditing = Boolean(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditing && productId) {
        setIsLoading(true);
        try {
          const product = await getProductById(productId);
          setFormData({
            name: product.name,
            quantity: product.quantity.toString(),
            description: product.description || "",
          });
        } catch (error) {
          toast.error("Error al cargar el producto");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProduct();
  }, [isEditing, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.quantity.trim()) {
      toast.error("El nombre y la cantidad son obligatorios");
      return;
    }

    const quantity = Number.parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("La cantidad debe ser un número válido mayor o igual a 0");
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        quantity,
        description: formData.description.trim() || undefined,
      };

      if (isEditing && productId) {
        await updateProduct(productId, productData);
        toast.success("Producto actualizado");
      } else {
        await createProduct(productData);
        toast.success("Producto creado");
      }

      onSuccess();
    } catch (error) {
      toast.error("No se pudo guardar el producto");
      console.error(error);
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
            <Label htmlFor="quantity">Cantidad disponible *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="Ej: 5"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
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
