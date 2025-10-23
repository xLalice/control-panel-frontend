import { ClientCreateInput, ClientFullData } from "./client.schema";

export const defaultCreateClient: ClientCreateInput = {
  clientName: "",
  accountNumber: "",
  primaryEmail: "",
  primaryPhone: "",
  billingAddressStreet: "",
  billingAddressCity: "",
  billingAddressRegion: "",
  billingAddressPostalCode: "",
  billingAddressCountry: "", 
  shippingAddressStreet: "",
  shippingAddressCity: "",
  shippingAddressRegion: "",
  shippingAddressPostalCode: "",
  shippingAddressCountry: "", 
  status: "Active",
  isActive: true,
  notes: null, 
};


export const defaultUpdateClient = (client: ClientFullData) => {
  return {
    ...client,
    accountNumber: client.accountNumber || "",
    primaryEmail: client.primaryEmail || "",
    primaryPhone: client.primaryPhone || "",
    notes: client.notes || null, 
    billingAddressStreet: client.billingAddressStreet || "",
    billingAddressCity: client.billingAddressCity || "",
    billingAddressRegion: client.billingAddressRegion || "",
    billingAddressPostalCode: client.billingAddressPostalCode || "",
    billingAddressCountry: client.billingAddressCountry || "",
    shippingAddressStreet: client.shippingAddressStreet || "",
    shippingAddressCity: client.shippingAddressCity || "",
    shippingAddressRegion: client.shippingAddressRegion || "",
    shippingAddressPostalCode: client.shippingAddressPostalCode || "",
    shippingAddressCountry: client.shippingAddressCountry || "",
    convertedFromLeadId: client.convertedFromLeadId || undefined,
  };
};