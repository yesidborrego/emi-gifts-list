"use client";

import { useMemo } from "react";
import { useGiftStore } from "@/hooks/use-gift-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Package, Users, Gift, TrendingUp } from "lucide-react";

export function AdminStats() {
  const { productos, usuarios, asignaciones, store } = useGiftStore();

  const stats = useMemo(() => {
    const totalProductos = productos.length;
    const totalUsuarios = usuarios.filter((u) => !u.esAdmin).length;
    const totalAsignaciones = asignaciones.length;

    const productosConAsignaciones = productos.filter((p) =>
      asignaciones.some((a) => a.productoId === p.id)
    ).length;

    const usuariosConAsignaciones = new Set(
      asignaciones.map((a) => a.usuarioId)
    ).size;

    const totalUnidadesAsignadas = asignaciones.reduce(
      (total, a) => total + a.cantidadAsignada,
      0
    );

    const totalUnidadesDisponibles = productos.reduce(
      (total, p) => total + store.obtenerCantidadDisponible(p.id),
      0
    );

    return {
      totalProductos,
      totalUsuarios,
      totalAsignaciones,
      productosConAsignaciones,
      usuariosConAsignaciones,
      totalUnidadesAsignadas,
      totalUnidadesDisponibles,
      porcentajeAsignacion:
        totalProductos > 0
          ? (productosConAsignaciones / totalProductos) * 100
          : 0,
    };
  }, [productos, usuarios, asignaciones, store]);

  const productosPopulares = useMemo(() => {
    const conteoAsignaciones = asignaciones.reduce((acc, asignacion) => {
      acc[asignacion.productoId] =
        (acc[asignacion.productoId] || 0) + asignacion.cantidadAsignada;
      return acc;
    }, {} as Record<string, number>);

    return productos
      .map((producto) => ({
        ...producto,
        totalAsignado: conteoAsignaciones[producto.id] || 0,
      }))
      .sort((a, b) => b.totalAsignado - a.totalAsignado)
      .slice(0, 5);
  }, [productos, asignaciones]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="slide-in-up hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalProductos} />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.productosConAsignaciones} con asignaciones
            </p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users
              className="h-4 w-4 text-muted-foreground float"
              style={{ animationDelay: "0.5s" }}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalUsuarios} />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.usuariosConAsignaciones} con regalos
            </p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asignaciones
            </CardTitle>
            <Gift
              className="h-4 w-4 text-muted-foreground float"
              style={{ animationDelay: "1s" }}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalAsignaciones} />
            </div>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={stats.totalUnidadesAsignadas} /> unidades
            </p>
          </CardContent>
        </Card>

        <Card className="slide-in-up hover-lift stagger-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <TrendingUp
              className="h-4 w-4 text-muted-foreground float"
              style={{ animationDelay: "1.5s" }}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalUnidadesDisponibles} />
            </div>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter
                value={Math.round(stats.porcentajeAsignacion * 10) / 10}
              />
              % asignado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Products */}
      <Card className="slide-in-up hover-lift stagger-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 float" />
            Productos Más Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productosPopulares.length > 0 ? (
            <div className="space-y-4">
              {productosPopulares.map((producto, index) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-glow slide-in-right"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full p-0 flex items-center justify-center scale-in"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{producto.nombre}</h4>
                      {producto.descripcion && (
                        <p className="text-sm text-muted-foreground">
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      <AnimatedCounter value={producto.totalAsignado} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      asignados
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground fade-in">
              No hay datos de asignaciones aún
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
