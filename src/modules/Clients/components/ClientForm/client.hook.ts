// src/modules/Clients/components/ClientForm/client.hook.ts

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCallback, useEffect } from "react";
import {
  clientCreateSchema,
  clientUpdateSchema,    
  ClientCreateInput,     
  ClientUpdatePayload,   
  ClientFullData,     
} from "./client.schema";
import { defaultCreateClient, defaultUpdateClient } from "./client.constants";
import { apiClient } from "@/api/api";


type ClientFormData = ClientCreateInput | ClientFullData;


interface UseClientFormProps {
  client?: ClientFullData; 
  onSuccess?: () => void;
}

export const useClientForm = ({ client, onSuccess }: UseClientFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(client?.id); 

  const form = useForm<ClientFormData>({ 
    resolver: zodResolver(isEditMode ? clientUpdateSchema : clientCreateSchema), 
    defaultValues: isEditMode && client ? defaultUpdateClient(client) : defaultCreateClient,
    mode: "onBlur",
  });

  useEffect(() => {
    if (isEditMode && client) {
      form.reset(defaultUpdateClient(client) as ClientFormData);
    } else if (!isEditMode) {
      form.reset(defaultCreateClient as ClientFormData);
    }
  }, [client, isEditMode, form]); 

  const clientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const basePayload = {
        isActive: data.isActive ?? true, 
        primaryEmail: data.primaryEmail?.trim() || null,
        primaryPhone: data.primaryPhone?.trim() || null,
        notes: data.notes?.trim() || null,
        clientName: data.clientName, 
        accountNumber: data.accountNumber || null,
        billingAddressStreet: data.billingAddressStreet || null,
        billingAddressCity: data.billingAddressCity || null,
        billingAddressRegion: data.billingAddressRegion || null,
        billingAddressPostalCode: data.billingAddressPostalCode || null,
        billingAddressCountry: data.billingAddressCountry || null,
        shippingAddressStreet: data.shippingAddressStreet || null,
        shippingAddressCity: data.shippingAddressCity || null,
        shippingAddressRegion: data.shippingAddressRegion || null,
        shippingAddressPostalCode: data.shippingAddressPostalCode || null,
        shippingAddressCountry: data.shippingAddressCountry || null,
        status: data.status,
      };

      if (isEditMode) {
        const updatePayload: ClientUpdatePayload = {
          ...(basePayload as ClientUpdatePayload),
        };
        const id = (data as ClientFullData).id; 
        if (!id) {
          throw new Error("Client ID is missing for update operation.");
        }
        const response = await apiClient.patch(
          `/clients/${id}`,
          updatePayload 
        );
        return response.data;
      } else {
        const createPayload: ClientCreateInput = basePayload as ClientCreateInput; 
        const response = await apiClient.post("/clients", createPayload); 
        return response.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", data.id] });
      toast.success(
        isEditMode
          ? "Client updated successfully"
          : "Client created successfully"
      );
      form.reset(); 
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${isEditMode ? "update" : "create"} client`;
      toast.error(errorMessage);
      console.error("Client mutation error:", error);
    },
  });

  const onSubmit = useCallback(
    (data: ClientFormData) => { 
      console.log("Onsubmit called with data:", data);
      clientMutation.mutate(data);
    },
    [clientMutation]
  );

  const copyBillingToShipping = useCallback(() => {
    const billingValues = form.getValues();
    const billingFields = [
      "billingAddressStreet",
      "billingAddressCity",
      "billingAddressRegion",
      "billingAddressPostalCode",
      "billingAddressCountry",
    ] as const;
    const shippingFields = [
      "shippingAddressStreet",
      "shippingAddressCity",
      "shippingAddressRegion",
      "shippingAddressPostalCode",
      "shippingAddressCountry",
    ] as const;

    billingFields.forEach((billingField, index) => {
      form.setValue(shippingFields[index], billingValues[billingField]);
    });

    toast.info("Billing address copied to shipping address");
  }, [form]);

  return {
    form,
    clientMutation,
    onSubmit,
    copyBillingToShipping,
    isEditMode,
    isSubmitting: clientMutation.isPending,
  };
};