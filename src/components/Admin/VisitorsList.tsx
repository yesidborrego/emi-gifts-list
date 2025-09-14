"use client";
import React, { useEffect } from "react";
import { useVisitorStore } from "@/store/use-visitor-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../ui/loading-spinner";
import { User, ShoppingCart, Users } from "lucide-react";

export const VisitorsList = () => {
  const { visitors, loading, error, fetchVisitors } = useVisitorStore();

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error al cargar los visitantes: {error}
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <Card className="slide-in-up">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay visitantes
          </h3>
          <p className="text-muted-foreground text-center">
            Aún no hay visitantes registrados en el sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Lista de Visitantes
      </h1>
      <div className="space-y-6">
        {visitors.map((visitor, index) => (
          <motion.div
            key={visitor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 gap-0">
              <CardHeader className="bg-muted/40">
                <CardTitle className="flex items-center gap-1 text-xl">
                  <User className="w-6 h-6 text-primary" />
                  {visitor.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-2">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Productos Seleccionados
                </h3>
                {visitor.products.length > 0 ? (
                  <ul className="space-y-3">
                    {visitor.products.map((product) => (
                      <li
                        key={product.id}
                        className="flex justify-between items-center p-3 bg-[#fcd5e3] rounded-md"
                      >
                        <span>{product.name}</span>
                        <span className="font-medium">
                          Cantidad: {product.pivot.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No se han seleccionado productos.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
