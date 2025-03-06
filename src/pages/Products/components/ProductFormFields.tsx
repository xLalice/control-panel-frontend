import React from "react";
import { ProductCategory, PricingModel, SourceLocation, FormProduct } from "../types"; // Ensure these types are imported
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormFieldsProps {
    product: FormProduct;
    setProduct: (updatedProduct: FormProduct) => void; 
    isEdit: boolean;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ product, setProduct, isEdit = false }) => {
    const prefix = isEdit ? "edit-" : "";

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}category`}>Category</Label>
                    <Select 
                        value={product.category} 
                        onValueChange={(value) => setProduct({...product, category: value as ProductCategory})}
                    >
                        <SelectTrigger id={`${prefix}category`}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aggregate">Aggregate</SelectItem>
                            <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
                            <SelectItem value="Steel">Steel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}name`}>Product Name</Label>
                    <Input 
                        id={`${prefix}name`} 
                        value={product.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, name: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${prefix}description`}>Description</Label>
                <Textarea 
                    id={`${prefix}description`} 
                    value={product.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProduct({...product, description: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}pricingModel`}>Pricing Model</Label>
                    <Select 
                        value={product.pricingModel} 
                        onValueChange={(value) => setProduct({...product, pricingModel: value as PricingModel})}
                    >
                        <SelectTrigger id={`${prefix}pricingModel`}>
                            <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PerHour">Per Hour</SelectItem>
                            <SelectItem value="PerDay">Per Day</SelectItem>
                            <SelectItem value="PerUnit">Per Unit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}unit`}>Unit</Label>
                    <Input 
                        id={`${prefix}unit`} 
                        value={product.unit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, unit: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}pickUpPrice`}>Pick Up Price</Label>
                    <Input 
                        id={`${prefix}pickUpPrice`} 
                        type="number"
                        value={product.pickUpPrice || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, pickUpPrice: parseFloat(e.target.value) || null})}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}deliveryPrice`}>Delivery Price</Label>
                    <Input 
                        id={`${prefix}deliveryPrice`} 
                        type="number"
                        value={product.deliveryPrice || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, deliveryPrice: parseFloat(e.target.value) || null})}
                    />
                </div>
            </div>

            {product.category === 'Aggregates' && (
                <div className="space-y-2">
                    <Label htmlFor={`${prefix}source`}>Source Location</Label>
                    <Select 
                        value={product.source} 
                        onValueChange={(value) => setProduct({...product, source: value as SourceLocation})}
                    >
                        <SelectTrigger id={`${prefix}source`}>
                            <SelectValue placeholder="Select source location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Batangas">Batangas</SelectItem>
                            <SelectItem value="Montalban">Montalban</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {product.category === 'Steel' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}grade`}>Grade</Label>
                        <Input 
                            id={`${prefix}grade`} 
                            value={product.grade || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, grade: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${prefix}length`}>Length</Label>
                        <Input 
                            id={`${prefix}length`} 
                            value={product.length || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct({...product, length: e.target.value})}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
