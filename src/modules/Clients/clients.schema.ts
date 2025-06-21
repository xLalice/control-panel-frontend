import { z } from "zod";

export const clientStatusEnum = z.enum(["Active", "Inactive", "OnHold"]);
export const clientSchema = z.object({
  id: z.string().uuid(),

  company: z
    .object({
      name: z.string().min(1, "Company name is required"),
      id: z.string().uuid(),
    })
    .optional()
    .nullable(),

  clientName: z.string().min(1, "Client name is required"),

  accountNumber: z.string().min(1, "Account number is required").optional(),

  primaryEmail: z.string().email("Invalid email").optional().nullable(),

  primaryPhone: z.string().min(5, "Invalid phone number").optional().nullable(),

  billingAddressStreet: z.string().optional().nullable(),
  billingAddressCity: z.string().optional().nullable(),
  billingAddressRegion: z.string().optional().nullable(),
  billingAddressPostalCode: z.string().optional().nullable(),
  billingAddressCountry: z.string().optional().nullable(),

  shippingAddressStreet: z.string().optional().nullable(),
  shippingAddressCity: z.string().optional().nullable(),
  shippingAddressRegion: z.string().optional().nullable(),
  shippingAddressPostalCode: z.string().optional().nullable(),
  shippingAddressCountry: z.string().optional().nullable(),

  status: clientStatusEnum.default("Active"),
  notes: z.string().optional().nullable(),

  convertedFromLeadId: z.string().uuid().optional().nullable(),

  isActive: z.boolean().default(true),

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime(),
});

export type Client = z.infer<typeof clientSchema>;
export type ClientStatus = z.infer<typeof clientStatusEnum>;
