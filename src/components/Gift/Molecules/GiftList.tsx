"use client";

import { useState, useEffect } from "react";
import { GiftCard } from "@/components/Gift/Atoms/GiftCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGuestStore } from "@/store/use-guest-store";
import { useProductStore } from "@/store/use-product-store";
import { registerProductsVisitor } from "@/services/apiVisitors.service";
import { Product } from "@/lib/types";
import { ThankYouModal } from "./ThankYouModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const GiftList = () => {
  const router = useRouter();
  const {
    products,
    initializeProducts,
    isLoading: isLoadingProducts,
    selectedProducts,
    setSelectedProducts,
    clearSelectedProducts,
  } = useProductStore();

  const {
    visitorId,
    isLoading: isGuestLoading,
    clearGuestName,
  } = useGuestStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  const handleSelectionChange = (product: Product, quantity: number) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      if (quantity > 0) {
        const updatedProducts = selectedProducts.map((p) =>
          p.id === product.id ? { ...p, amount: quantity } : p
        );
        setSelectedProducts(updatedProducts);
      } else {
        const filteredProducts = selectedProducts.filter(
          (p) => p.id !== product.id
        );
        setSelectedProducts(filteredProducts);
      }
    } else if (quantity > 0) {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, amount: quantity },
      ]);
    }
  };

  const handleSaveChanges = async () => {
    if (!visitorId || selectedProducts.length === 0) {
      toast.error("Por favor, selecciona al menos un producto.", {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerProductsVisitor(
        visitorId.toString(),
        selectedProducts
      );

      if (response.status === 200) {
        toast.success(
          "¡Gracias por tu generosidad! Tus regalos han sido registrados.",
          { duration: 3000 }
        );
        setShowThankYouModal(true);
      } else {
        toast.error(
          response.message || "Hubo un error al registrar tus regalos.",
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Ocurrió un error inesperado. Por favor, intenta de nuevo.", {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowThankYouModal(false);
    clearGuestName();
    clearSelectedProducts();
    router.push("/login");
  };

  const totalSelections = selectedProducts.reduce(
    (sum, product) => sum + (product.amount || 0),
    0
  );
  const hasSelections = totalSelections > 0;

  if (isLoadingProducts || isGuestLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Cargando aplicación..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={handleCloseModal}
        products={selectedProducts}
      />
      {hasSelections && (
        <Card
          className="bg-primary/5 border-primary/20 slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Resumen de Selecciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((p) => (
                <Badge
                  key={p.id}
                  variant="outline"
                  className="border-primary text-primary px-3 py-2"
                >
                  {p.name} ({p.amount})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const selectedProduct = selectedProducts.find(
            (p) => p.id === product.id
          );
          const currentSelection = selectedProduct ? selectedProduct.amount : 0;
          const availableQuantity = product.amount;

          return (
            <GiftCard
              key={product.id}
              product={product}
              availableQuantity={availableQuantity}
              assignedQuantity={0} // This was from assignment store, now 0
              currentSelection={currentSelection}
              onSelectionChange={(quantity) =>
                handleSelectionChange(product, quantity)
              }
            />
          );
        })}
      </div>
      {hasSelections && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={handleSaveChanges}
            disabled={isSubmitting}
            size="lg"
            className="shadow-lg"
          >
            {isSubmitting
              ? "Guardando..."
              : `Confirmar Selección (${totalSelections})`}
          </Button>
        </div>
      )}
    </div>
  );
};
