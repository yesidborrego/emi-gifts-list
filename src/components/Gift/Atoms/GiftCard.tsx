"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SuccessAnimation } from "@/components/ui/success-animation";
import type { Product } from "@/lib/types";

interface GiftCardProps {
  product: Product;
  availableQuantity: number;
  assignedQuantity: number;
  currentSelection: number;
  onSelectionChange: (quantity: number) => void;
}

export function GiftCard({
  product,
  availableQuantity,
  assignedQuantity,
  currentSelection,
  onSelectionChange,
}: GiftCardProps) {
  const [inputValue, setInputValue] = useState(currentSelection.toString());
  const [showSuccess, setShowSuccess] = useState(false);

  const handleIncrement = () => {
    if (currentSelection < availableQuantity) {
      const newValue = currentSelection + 1;
      onSelectionChange(newValue);
      setInputValue(newValue.toString());
      setShowSuccess(true);
    }
  };

  const handleDecrement = () => {
    if (currentSelection > 0) {
      const newValue = currentSelection - 1;
      onSelectionChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = Number.parseInt(value) || 0;
    if (numValue >= 0 && numValue <= availableQuantity) {
      onSelectionChange(numValue);
      if (numValue > currentSelection) {
        setShowSuccess(true);
      }
    }
  };

  const isSelected = assignedQuantity > 0 || currentSelection > 0;
  const isUnavailable = availableQuantity === 0;

  return (
    <>
      <Card
        className={`transition-all duration-300 hover-lift hover-glow cursor-pointer ${
          isSelected
            ? "ring-2 ring-primary bg-primary/5 border-primary/30 scale-in"
            : isUnavailable
            ? "opacity-60 bg-muted/50"
            : "hover:border-primary/50"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center md:items-start md:justify-between flex-col gap-3">
            <CardTitle className="text-lg leading-tight">
              {product.name}
            </CardTitle>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  isUnavailable
                    ? "secondary"
                    : availableQuantity <= 2
                    ? "destructive"
                    : "outline"
                }
                className="slide-in-right"
              >
                {availableQuantity} disponibles
              </Badge>
              {assignedQuantity > 0 && (
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground slide-in-left"
                >
                  {assignedQuantity} asignadas
                </Badge>
              )}
            </div>
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 fade-in">
              {product.description}
            </p>
          )}
        </CardHeader>

        <CardContent>
          {!isUnavailable ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecrement}
                  disabled={currentSelection <= 0}
                  className="w-10 h-10 rounded-full p-0 hover:bg-primary hover:text-primary-foreground bg-transparent button-press hover-rotate cursor-pointer"
                >
                  -
                </Button>

                <Input
                  type="number"
                  min="0"
                  max={availableQuantity}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-20 text-center font-semibold focus-ring"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIncrement}
                  disabled={currentSelection >= availableQuantity}
                  className="cursor-pointer w-10 h-10 rounded-full p-0 hover:bg-primary hover:text-primary-foreground button-press hover-rotate"
                >
                  +
                </Button>
              </div>

              {currentSelection > 0 && (
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-primary text-primary gift-bounce"
                  >
                    Seleccionaste {currentSelection}{" "}
                    {currentSelection === 1 ? "unidad" : "unidades"}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                Sin unidades disponibles
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <SuccessAnimation
        show={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />
    </>
  );
}
