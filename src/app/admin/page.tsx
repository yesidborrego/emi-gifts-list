"use client";

import { useState } from "react";
import { UserHeader } from "@/components/user-header";
import { ProductTable } from "@/components/Admin/ProductTable";
import { ProductForm } from "@/components/Admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Users } from "lucide-react";
import { VisitorsList } from "@/components/Admin/VisitorsList";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (productId: string) => {
    setEditingProduct(productId);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <UserHeader />

      <main className="container mx-auto px-4 py-6 w-full md:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 flex-col md:flex-row">
            <div className="w-full text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">
                Gestiona productos y visualiza estadísticas del sistema
              </p>
            </div>
            <Button
              onClick={handleNewProduct}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              {/* <TabsList className="w-full bg-[#e7e7e7] mb-1"> */}
              <TabsTrigger
                value="products"
                className="gap-2 w-full text-foreground cursor-pointer"
              >
                <Package className="w-4 h-4 text-foreground" />
                Productos
              </TabsTrigger>
              <TabsTrigger
                value="visitors"
                className="gap-2 w-full text-foreground cursor-pointer"
              >
                <Users className="w-4 h-4 text-foreground" />
                Listado de visitantes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <ProductTable onEditProduct={handleEditProduct} />
            </TabsContent>
            <TabsContent value="visitors" className="space-y-6">
              <VisitorsList />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <ProductForm
              productId={editingProduct}
              onClose={handleCloseForm}
              onSuccess={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
