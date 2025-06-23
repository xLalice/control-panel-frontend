import { z } from "zod";
import { clientSchema } from "../../clients.schema";

export const clientCreateSchema = clientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  company: true
});

export const clientUpdateSchema = clientSchema.partial();


export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdatePayload = z.infer<typeof clientUpdateSchema>;
export type ClientFullData = z.infer<typeof clientSchema>;

export type FormMode = 'create' | 'edit';