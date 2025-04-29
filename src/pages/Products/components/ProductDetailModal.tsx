import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, FormProduct } from "../types";
import { ProductFormFields } from "./ProductFormFields";
import { TrashIcon } from "lucide-react";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (data: Product) => void;
  isLoading?: boolean;
  onDelete: (id: string) => void;
  viewOnly?: boolean;
}

export const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading = false,
  onDelete,
  viewOnly = false,
}: ProductDetailModalProps) => {
  const [formProduct, setFormProduct] = useState<FormProduct>(
    {} as FormProduct
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormProduct(product as FormProduct);
    } else {
      setFormProduct({
        ...({} as FormProduct),
        isActive: true,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formProduct as Product);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {viewOnly ? "Product Details" : (product ? "Edit Product" : "Create Product")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ProductFormFields
            product={formProduct}
            setProduct={setFormProduct}
            isEdit={!viewOnly && !!product}
          />
          
          {!viewOnly && product  && (
            <div className="flex items-center space-x-2 mt-4">
              <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogTrigger>
                  <Button variant="destructive" type="button">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the product from the system.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsDeleting(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => {
                        onDelete(product.id);
                        setIsDeleting(false);
                        onClose();
                      }}
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              {viewOnly ? "Close" : "Cancel"}
            </Button>
            {!viewOnly && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};