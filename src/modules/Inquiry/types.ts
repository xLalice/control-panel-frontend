import { Lead } from "../Leads/types/leads.types";
import { Product } from "../Products/types";
import {z} from "zod";

export interface Inquiry {
  id: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  isCompany: boolean;
  companyName?: string | null;
  companyAddress?: string | null;
  productType: string;
  quantity: number;
  deliveryMethod: string;
  deliveryLocation: string;
  preferredDate: Date | string;
  referenceSource: string;
  remarks?: string | null;
  status: string;
  quotedPrice?: number | null;
  quotedBy?: {
    name: string;
  };
  quotedAt?: Date | string | null;
  relatedLeadId?: string | null;
  relatedLead?: Lead | null;
  createdById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  dueDate?: Date | string | null;
  inquiryType: InquiryType;
  priority?: Priority | null;
  assignedTo?: {
    id: string;
    name: string;
  };
  product?: Partial<Product>;
}

export enum InquiryStatus {
  New = "New",
  Quoted = "Quoted",
  Approved = "Approved",
  Scheduled = "Scheduled",
  Fulfilled = "Fulfilled",
  Cancelled = "Cancelled",
}

export enum InquiryType {
  PricingRequest = "PricingRequest",
  ProductAvailability = "ProductAvailability",
  TechnicalQuestion = "TechnicalQuestion",
  DeliveryInquiry = "DeliveryInquiry",
  Other = "Other",
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}


// DTO for updating an existing inquiry
export interface UpdateInquiryDto {
  customerName?: string;
  phoneNumber?: string;
  email?: string;
  isCompany?: boolean;
  companyName?: string;
  companyAddress?: string;
  productType?: string;
  quantity?: number;
  deliveryMethod?: DeliveryMethod;
  deliveryLocation?: string;
  preferredDate?: Date | string;
  referenceSource?: ReferenceSource;
  remarks?: string;
  status?: string;
}

export interface InquiryFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: ReferenceSource;
  productType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CountByStatus {
  status: string;
  count: number;
}

export interface CountBySource {
  source: string;
  count: number;
}

export interface CountByProductType {
  productType: string;
  count: number;
}

export interface MonthlyTrend {
  month: string | Date;
  count: number;
}

// Consolidated InquiryStatistics interface
export interface InquiryStatistics {
  totalInquiries: number;
  byStatus: CountByStatus[];
  bySource: CountBySource[];
  byProductType: CountByProductType[];
  monthlyTrends?: MonthlyTrend[] | null;
  conversionRate: number;
}

export interface ConversionResult {
  success: boolean;
  leadId?: string;
  message?: string;
}

export enum DeliveryMethod {
  Delivery = "Delivery",
  Pickup = "Pickup",
  ThirdParty = "ThirdParty",
}

export enum ReferenceSource {
  Facebook = "Facebook",
  Instagram = "Instagram",
  TikTok = "TikTok",
  Referral = "Referral",
  Flyers = "Flyers",
  Other = "Other",
}

export const formSchema = z.object({
  clientName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  isCompany: z.boolean().default(false),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  product: z.string().min(1, { message: "Please select a product." }),
  inquiryType: z.nativeEnum(InquiryType, {
    required_error: "Please select an inquiry type.",
  }),
  quantity: z.number().positive({ message: "Quantity must be positive." }),
  deliveryMethod: z.nativeEnum(DeliveryMethod).optional(),
  deliveryLocation: z
    .string()
    .min(1, { message: "Please enter a delivery location." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
  referenceSource: z.nativeEnum(ReferenceSource),
  priority: z.nativeEnum(Priority).optional(),
  remarks: z.string().optional(),
  relatedLeadId: z.string().optional(),
});

export type CreateInquiryDto = z.infer<typeof formSchema>