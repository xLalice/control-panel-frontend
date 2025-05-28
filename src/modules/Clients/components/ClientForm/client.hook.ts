import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCallback, useEffect } from "react";
import {
  ClientFormInput,
  clientUpdateSchema,
} from "./client.schema";
import { clientSchema } from "../../clients.schema";
import { defaultCreateClient, defaultUpdateClient } from "./client.constants";
import { apiClient } from "@/api/api";

interface UseClientFormProps {
  client?: ClientFormInput;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useClientForm = ({
  client,
  onSuccess,
}: UseClientFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(client);

  const form = useForm<ClientFormInput>({
    resolver: zodResolver(client ? clientUpdateSchema : clientSchema),
    defaultValues: isEditMode && client
      ? defaultUpdateClient(client)
      : defaultCreateClient,
    mode: "onBlur",
  });

  useEffect(() => {
    if (isEditMode && client) {
      form.reset(defaultUpdateClient(client));
    }
  }, [client, isEditMode, form]);

  const clientMutation = useMutation({
    mutationFn: async (data: ClientFormInput) => {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
        primaryEmail: data.primaryEmail?.trim() || null,
        primaryPhone: data.primaryPhone?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      if (isEditMode) {
        const response = await apiClient.patch(
          `/clients/${client?.id}`,
          payload
        );
        return response.data;
      } else {
        const response = await apiClient.post("/clients", payload);
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
    (data: ClientFormInput) => {
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
