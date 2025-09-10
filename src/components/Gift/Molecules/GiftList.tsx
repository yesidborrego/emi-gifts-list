"use client";

import { useState, useMemo } from "react";
import { GiftCard } from "@/components/Gift/Atoms/GiftCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Asignacion } from "@/lib/types";
import { useGiftStore } from "@/hooks/use-gift-store";

export function GiftList() {
  // const { guestName } = useGuestStore()
  const { productos, usuarioActual, store } = useGiftStore();
  const [selecciones, setSelecciones] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const asignacionesActuales = useMemo(() => {
    if (!usuarioActual) return [];
    return store.obtenerAsignacionesPorUsuario(usuarioActual.id);
  }, [usuarioActual, store]);

  const handleSeleccionChange = (productoId: string, cantidad: number) => {
    setSelecciones((prev) => ({
      ...prev,
      [productoId]: cantidad,
    }));
  };

  const handleGuardarSelecciones = async () => {
    if (!usuarioActual) return;

    setIsLoading(true);

    try {
      // Remove previous assignments for products that are being updated
      Object.keys(selecciones).forEach((productoId) => {
        const asignacionExistente = asignacionesActuales.find(
          (a) => a.productoId === productoId
        );
        if (asignacionExistente) {
          store.desasignarProducto(usuarioActual.id, productoId);
        }
      });

      // Add new assignments
      Object.entries(selecciones).forEach(([productoId, cantidad]) => {
        if (cantidad > 0) {
          store.asignarProducto(usuarioActual.id, productoId, cantidad);
        }
      });

      setSelecciones({});

      toast("Tus regalos han sido asignados correctamente.", {
        duration: 3000,
      });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar las selecciones",
        {
          duration: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalSelecciones = Object.values(selecciones).reduce(
    (sum, cantidad) => sum + cantidad,
    0
  );
  const haySelecciones = totalSelecciones > 0;

  return (
    <div className="space-y-6">
      {(haySelecciones || asignacionesActuales.length > 0) && (
        <Card
          className="bg-primary/5 border-primary/20 slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Resumen de Selecciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {asignacionesActuales.map((asignacion: Asignacion) => (
                <Badge
                  key={asignacion.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {asignacion.producto?.nombre} ({asignacion.cantidadAsignada})
                </Badge>
              ))}
              {Object.entries(selecciones).map(
                ([productoId, cantidad]) =>
                  cantidad > 0 && (
                    <Badge
                      key={productoId}
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      {productos.find((p) => p.id === productoId)?.nombre} (+
                      {cantidad})
                    </Badge>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto, index) => {
          const cantidadDisponible = store.obtenerCantidadDisponible(
            producto.id
          );
          const cantidadAsignada = producto.cantidad - cantidadDisponible;
          const seleccionActual = selecciones[producto.id] || 0;

          return (
            <div
              key={producto.id}
              className="slide-in-up"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <GiftCard
                product={producto}
                availableQuantity={cantidadDisponible}
                assignedQuantity={cantidadAsignada || 0}
                currentSelection={seleccionActual}
                onSelectionChange={(quantity: number) =>
                  handleSeleccionChange(producto.id, quantity)
                }
              />
            </div>
          );
        })}
      </div>

      {haySelecciones && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={handleGuardarSelecciones}
            disabled={isLoading}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl pulse-glow px-8 py-3 text-base font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Guardando...
              </div>
            ) : (
              `Guardar Selecciones (${totalSelecciones})`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
