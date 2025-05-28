import { z } from "zod";
import { clientSchema } from "../../clients.schema";

export const clientUpdateSchema = clientSchema.partial();


export type ClientFormInput = z.infer<typeof clientSchema>;
