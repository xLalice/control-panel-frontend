export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Lead {
  id: string;
  companyId: string;
  company: Company;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source: string;
  subSource?: string;
  campaign?: string;
  assignedToId?: string;
  assignedTo?: User;
  createdById: string;
  createdBy: User;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastContactDate?: Date | string;
  estimatedValue?: number;
  leadScore?: number;
  contactHistory: ContactHistory[];
  inquiries: Inquiry[];
  industry?: string;
  region?: string;
  referredBy?: string;
  followUpDate?: Date | string;
  activityLog: ActivityLog[];
}


export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  pageSize: number;
}



interface UpdateLeadParams {
  [key: string]: string;
}

export interface Report {
  id: string;
  date: Date;
  location: string;
  department: string;
  taskDetails: string;
  reportedBy: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  email?: string;
  phone?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  leads: Lead[];
}


