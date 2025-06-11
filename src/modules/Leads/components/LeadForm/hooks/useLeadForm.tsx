import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api";
import { Lead, LeadFormData } from "@/modules/Leads/types/leads.types";
import { toast } from "react-toastify";

interface UseLeadMutationOptions {
  onSuccess?: () => void;
  onClose?: () => void;
  isEditMode: boolean;
  leadId?: string;
}

export const useLeadMutation = ({
  onSuccess,
  onClose,
  isEditMode,
  leadId,
}: UseLeadMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LeadFormData) => {
      const payload = {
        ...data,
        estimatedValue: data.estimatedValue
          ? parseFloat(data.estimatedValue)
          : null,
        leadScore: data.leadScore ? data.leadScore : null,
      };

      if (isEditMode && leadId) {
        const response = await apiClient.put(`/leads/${leadId}`, payload);
        return response.data;
      } else {
        const response = await apiClient.post("/leads", payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      if (isEditMode && leadId) {
        queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      }

      onSuccess?.();
      onClose?.();
    },
    onError: (error) => {
      console.error("Lead mutation failed:", error);
      toast.error(
        isEditMode && leadId ? "Updating lead failed" : "Creating lead failed"
      );
    },
  });
};

interface UseLeadFormHookProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const useLeadForm = ({
  lead,
  onClose,
  onSuccess,
}: UseLeadFormHookProps) => {
  const isEditMode = !!lead;
  const defaultValues = useMemo(() => {
    return isEditMode
      ? {
          name: lead.name || "",
          companyId: lead.company?.id || "",
          companyName: lead.company?.name || "",
          contactPerson: lead.contactPerson || "",
          email: lead.company?.email || lead.email || "",
          phone: lead.company?.phone || lead.phone || "",
          status: lead.status || "New",
          industry: lead.industry || "",
          estimatedValue: lead.estimatedValue?.toString() || "",
          leadScore: lead.leadScore || 0,
          source: lead.source || "",
          notes: lead.notes || "",
          assignedToId: lead.assignedTo?.id || "",
        }
      : {
          name: "",
          companyId: "",
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          status: "New",
          industry: "",
          estimatedValue: "",
          leadScore: 0,
          source: "",
          notes: "",
          assignedToId: "",
        };
  }, [lead, isEditMode]);

  const form = useForm<LeadFormData>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const {
    mutate: submitLead,
    isPending: isSubmitting,
    isError: isSubmitError,
    error: submitError,
  } = useLeadMutation({
    onSuccess: () => {
      form.reset(defaultValues);
      onSuccess?.();
      onClose?.();
    },
    onClose: onClose,
    isEditMode,
    leadId: lead?.id,
  });

  const onSubmit = (data: LeadFormData) => {
    submitLead(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    isSubmitError,
    submitError,
    isEditMode,
  };
};
