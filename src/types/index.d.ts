export interface User {
  name: string;
  id: string;
  email: string;
  roleId: number;
  role: Role;
  isOJT: boolean;
  ojtStartDate: Date | null;
  ojtEndDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface LoginSuccess {
  user: User;
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
