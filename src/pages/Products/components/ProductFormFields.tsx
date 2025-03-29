import React from "react";
import { Category, FormProduct } from "../types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormFieldsProps {
  product: FormProduct;
  setProduct: (updatedProduct: FormProduct) => void;
  isEdit: boolean;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  product,
  setProduct,
  isEdit = false,
}) => {
  const prefix = isEdit ? "edit-" : "";

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}category`}>Category</Label>
          <Select
            value={product.category}
            onValueChange={(value) =>
              setProduct({ ...product, category: value as Category })
            }
            disabled={isEdit}
          >
            <SelectTrigger id={`${prefix}category`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Category.AGGREGATE}>Aggregate</SelectItem>
              <SelectItem value={Category.HEAVY_EQUIPMENT}>Heavy Equipment</SelectItem>
              <SelectItem value={Category.STEEL}>Steel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}name`}>Product Name</Label>
          <Input
            id={`${prefix}name`}
            value={product.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, name: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}description`}>Description</Label>
        <Textarea
          id={`${prefix}description`}
          value={product.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}basePrice`}>Base Price</Label>
          <Input
            id={`${prefix}basePrice`}
            type="number"
            value={product.basePrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                basePrice: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}pricingUnit`}>Pricing Unit</Label>
          <Input
            id={`${prefix}pricingUnit`}
            value={product.pricingUnit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, pricingUnit: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}unit`}>Unit</Label>
        <Input
          id={`${prefix}unit`}
          value={product.unit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProduct({ ...product, unit: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}pickUpPrice`}>Pick Up Price</Label>
          <Input
            id={`${prefix}pickUpPrice`}
            type="number"
            value={product.pickUpPrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                pickUpPrice: parseFloat(e.target.value) || null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}deliveryPrice`}>Delivery Price</Label>
          <Input
            id={`${prefix}deliveryPrice`}
            type="number"
            value={product.deliveryPrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                deliveryPrice: parseFloat(e.target.value) || null,
              })
            }
          />
        </div>
      </div>

      {/* Category-specific fields */}
      {product.category === Category.AGGREGATE && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}source`}>Source Location</Label>
            <Input
              id={`${prefix}source`}
              value={product.source || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({ ...product, source: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}weightPerUnit`}>Weight Per Unit</Label>
            <Input
              id={`${prefix}weightPerUnit`}
              type="number"
              value={product.weightPerUnit || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({
                  ...product,
                  weightPerUnit: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
        </div>
      )}

      {product.category === Category.HEAVY_EQUIPMENT && (
        <div className="space-y-2">
          <Label htmlFor={`${prefix}equipmentType`}>Equipment Type</Label>
          <Input
            id={`${prefix}equipmentType`}
            value={product.equipmentType || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, equipmentType: e.target.value })
            }
          />
        </div>
      )}

      {product.category === Category.STEEL && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}grade`}>Grade</Label>
              <Input
                id={`${prefix}grade`}
                value={product.grade || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, grade: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${prefix}length`}>Length</Label>
              <Input
                id={`${prefix}length`}
                value={product.length || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, length: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}type`}>Type</Label>
              <Input
                id={`${prefix}type`}
                value={product.type || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, type: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${prefix}color`}>Color</Label>
              <Input
                id={`${prefix}color`}
                value={product.color || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, color: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}size`}>Size</Label>
            <Input
              id={`${prefix}size`}
              value={product.size || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({ ...product, size: e.target.value })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};