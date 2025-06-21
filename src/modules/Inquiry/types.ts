import { User } from "@/types/sharedTypes";
import { Lead } from "../Leads/types/leads.types";
import { z } from "zod";
import { Product } from "../Products/types";
import { Client } from "../Clients/clients.schema";

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
  leadOriginated?: Lead;
  lead?: Lead;
  leadId?: string;
  client?: Client;
  clientId?: string;
  createdById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  dueDate?: Date | string | null;
  inquiryType: InquiryType;
  priority?: Priority | null;
  assignedTo?: User;
  items: InquiryItem[];
}

export interface InquiryItem {
  inquiryId: string;
  productId: string;
  product: Product;
  quantity: number;
  remarks?: number;
}

export enum InquiryStatus {
  New = "New",
  Reviewed = "Reviewed",
  ConvertedToLead = "ConvertedToLead",
  AssociatedToClient = "AssociatedToClient",
  Closed = "Closed",
  QuotationGenerated = "QuotationGenerated",
  DeliveryScheduled = "DeliveryScheduled",
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

export interface CountByReferenceSource {
  referenceSource: string;
  count: number;
}

export interface CountByProduct {
  product: string;
  count: number;
}

export interface CountByInquiryTpe {
  inquiryType: string;
  count: number;
}

export interface CountByPriority {
  priority: string;
  count: number;
}

export interface CountByDeliveryMethod {
  deliveryMethod: string;
  count: number;
}

export interface MonthlyTrend {
  month: Date;
  count: bigint;
  converted: bigint;
  closed: bigint;
}

interface DailyTrend {
  date: Date | string;
  count: number;
}

// Consolidated InquiryStatistics interface
export interface InquiryStatistics {
  totalInquiries: number;
  byStatus: CountByStatus[];
  byReferenceSource: CountByReferenceSource[];
  byProductType: CountByProduct[];
  byInquiryType: CountByInquiryTpe[];
  byPriority: CountByPriority[];
  byDeliveryMethod: CountByDeliveryMethod[];
  monthlyTrends?: MonthlyTrend[] | null;
  dailyTrends?: DailyTrend[] | null;
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

const inquiryItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const formSchema = z.object({
  clientName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  isCompany: z.boolean().default(false),
  companyName: z.string().optional().or(z.literal("")),
  companyAddress: z.string().optional().or(z.literal("")),
  inquiryType: z.nativeEnum(InquiryType),
  deliveryMethod: z.string().optional(),
  deliveryLocation: z.string().optional(),
  preferredDate: z.date().nullable(),
  referenceSource: z.string().optional(),
  priority: z.nativeEnum(Priority).default(Priority.Medium),
  remarks: z.string().optional(),
  relatedLeadId: z.string().optional(),

  items: z.array(inquiryItemSchema).min(1, "At least one item is required"),
});

export type CreateInquiryDto = z.infer<
  typeof formSchema & {
    items: InquiryItem[];
  }
>;


const quotationItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be a positive number"),
  lineTotal: z.number().min(0, "Line total must be calculated"),
});

export const quotationSchema = z.object({
  fromEntity: z.object({
    id: z.string(),
    entityType: z.enum(["lead", "client", "inquiry"])
  }),
  validUntil: z.date().min(new Date(), "Valid until date must be in the future"),
  subtotal: z.number().min(0, "Subtotal must be a positive number"),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  total: z.number().min(0, "Total must be a positive number"),
  notesToCustomer: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;