export enum QuotationStatus {
    Draft = 'DRAFT',
    Sent =  'SENT',
    Accepted =  'ACCEPTED',
    Rejected =  'REJECTED'
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
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}