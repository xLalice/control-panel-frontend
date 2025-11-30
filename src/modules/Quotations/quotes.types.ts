import { Lead } from "../Leads/types/leads.types";

export enum QuotationStatus {
    Draft = 'Draft',
    Sent =  'Sent',
    Accepted =  'Accepted',
    Rejected =  'Rejected'
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  status: QuotationStatus;
  
  createdAt: string; 
  updatedAt: string;
  validUntil: string; 
  
  subtotal: number;
  total: number;

  clientId?: string;
  client?: {
    id: string;
    clientName: string;
  };
  
  items: QuotationItem[];

  lead?: Partial<Lead>;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}