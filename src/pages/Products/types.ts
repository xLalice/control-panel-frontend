export enum Category {
  AGGREGATE = "AGGREGATE",
  HEAVY_EQUIPMENT = "HEAVY_EQUIPMENT",
  STEEL = "STEEL"
}
export type SourceLocation = "Batangas" | "Montalban" | "Other";
export type PricingModel = "PerHour" | "PerDay" | "PerUnit";

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  basePrice: number;
  pricingUnit: string;
  pricingDetails?: object;
  unit: string;
  pickUpPrice: number | null;
  deliveryPrice: number | null;
  createdAt: string;
  updatedAt: string;
  
  // Category-specific fields
  source?: string;
  weightPerUnit?: number;
  equipmentType?: string;
  grade?: string;
  length?: string;
  type?: string;
  color?: string;
  size?: string;
  additionalAttributes?: object;
}

export const defaultProduct: FormProduct = {
  category: Category.AGGREGATE,
  name: "",
  description: "",
  basePrice: 0,
  pricingUnit: "",
  unit: "",
  pickUpPrice: null,
  deliveryPrice: null
};

export const TAB_TO_CATEGORY_MAP: Record<string, string | null> = {
  all: null,
  aggregate: "Aggregate",
  "heavy equipment": "Heavy Equipment",
  steel: "Steel",
};

export interface FormProduct {
  id?: string;
  category: Category;
  name: string;
  description: string;
  basePrice: number;
  pricingUnit: string;
  pricingDetails?: object;
  unit: string;
  pickUpPrice: number | null;
  deliveryPrice: number | null;
  
  // Aggregate fields
  source?: string;
  weightPerUnit?: number;
  
  // Heavy Equipment fields
  equipmentType?: string;
  
  // Steel fields
  grade?: string;
  length?: string;
  type?: string;
  color?: string;
  size?: string;
  additionalAttributes?: object;
}