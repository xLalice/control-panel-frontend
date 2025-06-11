import { LeadStatus } from "../constants/constants";
import { DateRange } from "react-day-picker";
import { User } from "@/types";

type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export interface Lead {
  id: string;
  name: string;
  companyId: string;
  company: Company;
  email: string;
  phone: string;
  contactPerson: string;
  status: LeadStatus;
  source: string;
  subSource?: string;
  assignedToId?: string;
  assignedTo: User;
  lastContactDate: string | null;
  leadScore: number | null;
  industry: string | null;
  followUpDate?: Date;
  activityLog: ActivityLog[];
  estimatedValue?: number;
  campaign?: string;
  referredBy?: string;
  createdAt?: string;
  notes?: string;
  contactHistory: ContactHistory[];
}

export type Filters = {
  search: string;
  status?: string;
  assignedTo?: string;
  source?: string;
  industry?: string;
  region?: string;
  dateRange?: DateRange;
};

export type Company = {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  leads: Lead[];
};

export type ActivityLog = {
  id: string;
  leadId: string;
  userId: string;
  action: string;
  description: string;
  metadata: ActivityLogMetadata;
  oldStatus?: LeadStatus;
  newStatus?: LeadStatus;
  createdBy: User;

  user: {
    name: string
  };

  createdAt: Date;
  lead: Lead;
};

export type ActivityLogMetadata =
  | Array<{
      field: string;
      old: any;
      new: any;
    }>
  | { initialData: any }
  | null;

export interface ContactHistory {
  id: string;
  leadId: string;
  method: string;
  summary: string;
  outcome?: string;
  timestamp: Date;
  lead: Lead;
}

export interface LeadFormData {
  name: string;
  companyId: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: string;
  industry?: string;
  estimatedValue?: string;
  source?: string;
  notes?: string;
  assignedToId: string;
  leadScore: number;
}

export interface LeadFormProps {
  lead?: Lead;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}
