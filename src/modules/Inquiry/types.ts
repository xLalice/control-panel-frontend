import { Lead } from "@/types";

export interface Inquiry {
  id: string;
  customerName: string;
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
  quotedBy?: string | null;
  quotedAt?: Date | string | null;
  relatedLeadId?: string | null;
  relatedLead?: Lead | null;
  createdById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  dueDate?: Date | string | null;
  inquiryType: InquiryType;
  priority?: Priority | null;
  assignedTo?: string | null;
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

// DTO for creating a new inquiry
export interface CreateInquiryDto {
  customerName: string;
  phoneNumber: string;
  email: string;
  isCompany?: boolean;
  companyName?: string;
  companyAddress?: string;
  productType: string;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  deliveryLocation: string;
  preferredDate: Date | string;
  referenceSource: ReferenceSource;
  remarks?: string;
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

// Parameters for filtering inquiries
export interface InquiryFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: ReferenceSource;
  productType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

// Generic paginated response type
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
  Delivery = 'Delivery',
  Pickup = 'Pickup',
  ThirdParty = 'ThirdParty'
}

export enum ReferenceSource {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  TikTok = 'TikTok',
  Referral = 'Referral',
  Flyers = 'Flyers',
  Other = 'Other'
}

export interface EnhancedInquiry extends Inquiry {
  assignedTo?: string;
}