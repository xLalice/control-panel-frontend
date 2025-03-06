export type ProductCategory = "Aggregates" | "HeavyEquipment" | "Steel";
export type SourceLocation = "Batangas" | "Montalban" | "Other";
export type PricingModel = "PerHour" | "PerDay" | "PerUnit";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  source?: SourceLocation;
  pickUpPrice?: number | null | undefined;
  deliveryPrice?: number | null | undefined;
  pricingModel?: PricingModel;
  unit?: string;
  grade?: string;
  length?: string;
}

export const DEFAULT_PRODUCT: Omit<Product, "id"> = {
  category: "Aggregates",
  name: "",
  description: "",
  pricingModel: "PerUnit",
  unit: "cbm",
};

export const TAB_TO_CATEGORY_MAP: Record<string, string | null> = {
  all: null,
  aggregate: "Aggregate",
  "heavy equipment": "Heavy Equipment",
  steel: "Steel",
};

export type FormProduct = Omit<Product, "id"> & { id?: string | number };