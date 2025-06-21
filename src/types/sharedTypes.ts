import { LeadStatus } from "@/modules/Leads/constants/constants";
import { Lead } from "@/modules/Leads/types/leads.types";

export type User = {
    id: string;
    email: string;
    name: string;
    roleId: string;
    role: Role;
    isOJT: boolean;
    ojtStartDate?: string;
    ojtEndDate?: string;
    ojtSupervisorId?: string;
  };

export type EntityType = 'Lead' | 'Inquiry' | 'Client'; 

export type EntityReference = {
  entityId: string;
  entityType: EntityType;
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: string; 
  description: string; 
  entity: EntityReference; 

  metadata: ActivityLogMetadata;
  oldStatus?: typeof LeadStatus; 
  newStatus?: typeof LeadStatus; 

  createdBy: User; 
  user: {
    name: string;
  };

  createdAt: Date;
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
  method: string;
  summary: string; 
  outcome?: string; 
  timestamp: Date; 
  entity: EntityReference; 
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

import {z} from "zod";

export const EntityTypeEnum = ['Lead', 'Inquiry', 'Client'] as const;
export const EntityTypeSchema = z.enum(EntityTypeEnum, {
  message: `Invalid entity type. Expected one of: ${EntityTypeEnum.join(', ')}.`,
});


export const ContactMethodEnum = ['Call', 'Email', 'Meeting', 'SMS', 'In-Person'] as const;
export const ContactMethodSchema = z.enum(ContactMethodEnum, {
  message: `Invalid contact method. Expected one of: ${ContactMethodEnum.join(', ')}.`,
});


export const ContactOutcomeEnum = [
  'Successful',
  'No Answer',
  'Left Voicemail',
  'Follow-up Needed',
  'Next Steps Defined',
  'Not Interested'
] as const;
export const ContactOutcomeSchema = z.enum(ContactOutcomeEnum, {
  message: `Invalid contact outcome. Expected one of: ${ContactOutcomeEnum.join(', ')}.`,
}).optional(); 


export const LogContactHistorySchema = z.object({
  method: ContactMethodSchema,
  summary: z.string().min(1, 'Summary cannot be empty.').max(1000, 'Summary cannot exceed 1000 characters.'),
  outcome: ContactOutcomeSchema,
  timestamp: z.string()
    .min(1, 'Timestamp is required.')
    .transform((str, ctx) => {
      // Input from datetime-local is YYYY-MM-DDTHH:MM
      // We append ':00.000' to make it a more complete string for Date constructor
      const date = new Date(str + ':00.000');

      // Check if the date object is valid
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date/time format. Please ensure it is a valid date and time.',
        });
        return z.NEVER; // Signal that transformation failed
      }

      // Convert to full ISO 8601 string (UTC) for validation by .datetime()
      return date.toISOString();
    })
    // Pipe the transformed (UTC ISO 8601) string to the datetime validator
    .pipe(z.string().datetime({ message: 'Invalid timestamp format. Expected ISO 8601 string.' })),
  entityId: z.string().uuid('Invalid entity ID format.'),
  entityType: EntityTypeSchema,
});

export type LogContactHistoryInput = z.infer<typeof LogContactHistorySchema>;