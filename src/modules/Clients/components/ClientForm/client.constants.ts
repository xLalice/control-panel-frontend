import { ClientFormInput } from "./client.schema";

export const defaultCreateClient: ClientFormInput = {
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
  notes: "",
  isActive: true,
};

export const defaultUpdateClient = (client: ClientFormInput): ClientFormInput => ({
  ...defaultCreateClient,
  ...client,
});