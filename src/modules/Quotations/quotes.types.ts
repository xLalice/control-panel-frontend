import { Client } from "../Clients/clients.schema";
import { Lead } from "../Leads/types/leads.types";

export enum QuotationStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Converted = "Converted"
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  status: QuotationStatus;

  createdAt: string;
  updatedAt: string;
  validUntil: Date;

  subtotal: number;
  total: number;
  discount: number;
  tax: number;

  issueDate: Date;
  notesToCustomer: string;

  clientId?: string;
  client?: Client;

  items: QuotationItem[];

  leadId?: string;
  lead?: Partial<Lead>;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productId: string;
}