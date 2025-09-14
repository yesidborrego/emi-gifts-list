import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ThankYouModal = ({
  isOpen,
  onClose,
  products,
}: ThankYouModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            ¡Muchas gracias!
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-muted-foreground">
            Tu generosidad hace una gran diferencia. <br /> A continuación, un
            resumen de los regalos que has seleccionado:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {products.map((product) => (
              <Badge
                key={product.id}
                variant="secondary"
                className="text-base px-4 py-1"
              >
                {`${product.name}: ${product.amount}`}
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Cerrar y finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
