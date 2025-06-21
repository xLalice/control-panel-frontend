import { z } from "zod";
import { clientSchema } from "../../clients.schema";


export const clientCreateSchema = clientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const clientUpdateSchema = clientSchema.partial();

export type FormMode = 'create' | 'edit';


export type ClientFormInput = z.infer<typeof clientCreateSchema>;

