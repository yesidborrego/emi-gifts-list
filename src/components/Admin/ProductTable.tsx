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
// import {
//   getProducts,
//   deleteProduct,
//   getAvailableQuantity,
// } from "@/lib/supabase-functions";
// import type { Product } from "@/lib/types";
import { useGiftStore } from "@/hooks/use-gift-store";
import { useState } from "react";

interface ProductTableProps {
  onEditProduct: (productId: string) => void;
}

export function ProductTable({ onEditProduct }: ProductTableProps) {
  const { productos, store } = useGiftStore();
  // const [products, setProducts] = useState<Product[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // const [availableQuantities, setAvailableQuantities] = useState<
  //   Record<string, number>
  // >({});

  /* const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await getProducts();
      setProducts(productsData);
      const quantities: Record<string, number> = {};
      for (const product of productsData) {
        const available = await getAvailableQuantity(product.id);
        quantities[product.id] = available;
      }
      setAvailableQuantities(quantities);
    } catch (error) {
      toast.error("Error al cargar los productos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); */

  /* const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      toast.success("Producto eliminado");
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast.error("No se pudo eliminar el producto");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }; */

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingId(productId);
      store.eliminarProducto(productId);

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

  /* if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  } */

  if (productos.length === 0) {
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
      {productos.map((producto, index) => {
        const cantidadDisponible = store.obtenerCantidadDisponible(producto.id);
        const cantidadAsignada = producto.cantidad - cantidadDisponible;

        return (
          <Card
            key={producto.id}
            className="slide-in-up hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                  {producto.descripcion && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {producto.descripcion}
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
                          producto &quot;{producto.nombre}&quot; y todas sus
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
                  Total: {producto.cantidad}
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
