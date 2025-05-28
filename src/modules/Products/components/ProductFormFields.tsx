import React from "react";
import { Category, FormProduct, PricingUnit } from "../types";
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

const RequiredAsterisk = () => <span className="text-red-500">*</span>;
const OptionalText = () => (
  <span className="text-gray-500 text-sm">(optional)</span>
);

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  product,
  setProduct,
  isEdit = false
}) => {
  const prefix = isEdit ? "edit-" : "";

  const getDefaultUnitForPricing = (pricingUnit: PricingUnit): string => {
    switch (pricingUnit) {
      case PricingUnit.KILOGRAM:
        return "kg";
      case PricingUnit.TON:
        return "ton";
      case PricingUnit.METER:
        return "m";
      case PricingUnit.DAY:
        return "day";
      default:
        return "";
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}category`}>
            Category <RequiredAsterisk />
          </Label>
          <Select
            value={product.category}
            onValueChange={(value) =>
              setProduct({ ...product, category: value as Category })
            }
            disabled={isEdit}
            required
          >
            <SelectTrigger id={`${prefix}category`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Category.AGGREGATE}>Aggregate</SelectItem>
              <SelectItem value={Category.HEAVY_EQUIPMENT}>
                Heavy Equipment
              </SelectItem>
              <SelectItem value={Category.STEEL}>Steel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}name`}>
            Product Name <RequiredAsterisk />
          </Label>
          <Input
            id={`${prefix}name`}
            value={product.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, name: e.target.value })
            }
            placeholder="Enter product name"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor={`${prefix}description`}>
          Description <RequiredAsterisk />
        </Label>
        <Textarea
          id={`${prefix}description`}
          value={product.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Enter product description..."
          required
        />
      </div>

      {/* Pricing Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}basePrice`}>
            Base Price <RequiredAsterisk />
          </Label>
          <Input
            id={`${prefix}basePrice`}
            type="number"
            min="0"
            step="0.01"
            value={product.basePrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                basePrice: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}pricingUnit`}>
            Pricing Unit <RequiredAsterisk />
          </Label>
          <Select
            value={product.pricingUnit}
            onValueChange={(value) => {
              const newPricingUnit = value as PricingUnit;
              setProduct({
                ...product,
                pricingUnit: newPricingUnit,
                // Auto-set unit when pricing unit changes
                unit: getDefaultUnitForPricing(newPricingUnit),
              });
            }}
            required
          >
            <SelectTrigger id={`${prefix}pricingUnit`}>
              <SelectValue placeholder="Select pricing unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PricingUnit.DAY}>Day</SelectItem>
              <SelectItem value={PricingUnit.METER}>Meter</SelectItem>
              <SelectItem value={PricingUnit.KILOGRAM}>Kilogram</SelectItem>
              <SelectItem value={PricingUnit.TON}>Ton</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}unit`}>
          Display Unit <RequiredAsterisk />
          <span className="text-gray-500 text-sm ml-2">
            (defaults to pricing unit)
          </span>
        </Label>
        <Input
          id={`${prefix}unit`}
          value={product.unit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProduct({ ...product, unit: e.target.value })
          }
          placeholder="e.g., kg, tons"
          required
        />
      </div>

      {/* Delivery Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}pickUpPrice`}>
            Pick Up Price <RequiredAsterisk />
          </Label>
          <Input
            id={`${prefix}pickUpPrice`}
            type="number"
            min="0"
            step="0.01"
            value={product.pickUpPrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                pickUpPrice: parseFloat(e.target.value) || null,
              })
            }
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}deliveryPrice`}>
            Delivery Price <RequiredAsterisk />
          </Label>
          <Input
            id={`${prefix}deliveryPrice`}
            type="number"
            min="0"
            step="0.01"
            value={product.deliveryPrice || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({
                ...product,
                deliveryPrice: parseFloat(e.target.value) || null,
              })
            }
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Category-specific fields */}
      {product.category === Category.AGGREGATE && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}source`}>
              Source Location <OptionalText />
            </Label>
            <Input
              id={`${prefix}source`}
              value={product.source || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({ ...product, source: e.target.value })
              }
              placeholder="Enter source location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}weightPerUnit`}>
              Weight Per Unit <OptionalText />
            </Label>
            <Input
              id={`${prefix}weightPerUnit`}
              type="number"
              min="0"
              step="0.01"
              value={product.weightPerUnit || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({
                  ...product,
                  weightPerUnit: parseFloat(e.target.value) || undefined,
                })
              }
              placeholder="Enter weight per unit"
            />
          </div>
        </div>
      )}

      {product.category === Category.HEAVY_EQUIPMENT && (
        <div className="space-y-2">
          <Label htmlFor={`${prefix}equipmentType`}>
            Equipment Type <OptionalText />
          </Label>
          <Input
            id={`${prefix}equipmentType`}
            value={product.equipmentType || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, equipmentType: e.target.value })
            }
            placeholder="Enter equipment type"
          />
        </div>
      )}

      {product.category === Category.STEEL && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}grade`}>
                Grade <OptionalText />
              </Label>
              <Input
                id={`${prefix}grade`}
                value={product.grade || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, grade: e.target.value })
                }
                placeholder="Enter grade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${prefix}length`}>
                Length <OptionalText />
              </Label>
              <Input
                id={`${prefix}length`}
                value={product.length || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, length: e.target.value })
                }
                placeholder="Enter length"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}type`}>
                Type <OptionalText />
              </Label>
              <Input
                id={`${prefix}type`}
                value={product.type || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, type: e.target.value })
                }
                placeholder="Enter type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${prefix}color`}>
                Color <OptionalText />
              </Label>
              <Input
                id={`${prefix}color`}
                value={product.color || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, color: e.target.value })
                }
                placeholder="Enter color"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${prefix}size`}>
              Size <OptionalText />
            </Label>
            <Input
              id={`${prefix}size`}
              value={product.size || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({ ...product, size: e.target.value })
              }
              placeholder="Enter size"
            />
          </div>
        </>
      )}
    </div>
  );
};
