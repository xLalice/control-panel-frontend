import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PackagePlus } from "lucide-react";
import { MovementType, Product } from "../product.types"; 


interface AdjustStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (
    productId: string,
    data: { type: MovementType; quantity: number; reason: string }
  ) => void;
  isLoading: boolean;
}

export const AdjustStockDialog = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading,
}: AdjustStockDialogProps) => {
  const [type, setType] = useState<MovementType>(MovementType.IN);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setType(MovementType.IN); 
      setQuantity("");
      setReason("");
    }
  }, [isOpen, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !quantity) return;

    onConfirm(product.id, {
      type,
      quantity: Number(quantity),
      reason,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            Adjust Stock Level
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Product</Label>
            <div className="font-medium">{product?.name}</div>
            <div className="text-sm text-muted-foreground">
              Current Stock: <span className="text-foreground font-bold">{product?.quantityOnHand || 0}</span> {product?.unit}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Action Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as MovementType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MovementType.IN}>Receive (IN)</SelectItem>
                  <SelectItem value={MovementType.OUT}>Remove (OUT)</SelectItem>
                  <SelectItem value={MovementType.ADJUSTMENT}>Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason / Reference</Label>
            <Textarea
              id="reason"
              placeholder={
                type === MovementType.IN
                  ? "e.g., PO #1234, Delivery from Supplier"
                  : "e.g., Damaged, Sold, Yearly Audit"
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !quantity}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};