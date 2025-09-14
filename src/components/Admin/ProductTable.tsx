"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Edit, Trash2, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAssignmentStore } from "@/store/use-assignment-store";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/use-product-store";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ProductTableProps {
  onEditProduct: (productId: string) => void;
}

export function ProductTable({ onEditProduct }: ProductTableProps) {
  const { products, deleteProduct, initializeProducts, isLoading } =
    useProductStore();
  const { assignments } = useAssignmentStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingId(productId);
      await deleteProduct(productId);

      toast.success("El producto ha sido eliminado correctamente.", {
        duration: 3000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto",
        { duration: 3000 }
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="slide-in-up">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay productos
          </h3>
          <p className="text-muted-foreground text-center">
            Comienza agregando tu primer producto al sistema
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((producto, index) => {
        const cantidadAsignada = assignments
          .filter((a) => a.productId === producto.id)
          .reduce((sum, a) => sum + a.assignedAmount, 0);
        const cantidadDisponible = producto.amount - cantidadAsignada;

        return (
          <Card
            key={producto.id}
            className="slide-in-up hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{producto.name}</CardTitle>
                  {producto.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {producto.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProduct(producto.id)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === producto.id}
                        className="hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el
                          producto &quot;{producto.name}&quot; y todas sus
                          asignaciones.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProduct(producto.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Total: {producto.amount}
                </Badge>
                <Badge
                  variant={cantidadDisponible > 0 ? "secondary" : "destructive"}
                  className="gap-1"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cantidadDisponible > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  Disponibles: {cantidadDisponible}
                </Badge>
                {cantidadAsignada > 0 && (
                  <Badge variant="default" className="gap-1">
                    <span className="w-2 h-2 bg-primary-foreground rounded-full" />
                    Asignados: {cantidadAsignada}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
