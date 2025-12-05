import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Lead, LeadFormData } from "@/modules/Leads/types/leads.types";
import { toast } from "react-toastify";
import { useCreateLead, useUpdateLead } from "@/modules/Leads/hooks/useLeadsHooks";

interface UseLeadFormHookProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const useLeadForm = ({ lead, onClose, onSuccess }: UseLeadFormHookProps) => {
  const isEditMode = !!lead;

  const {
    mutate: createLead,
    isPending: isCreating,
    isError: isCreateError,
    error: createError
  } = useCreateLead();

  const {
    mutate: updateLead,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError
  } = useUpdateLead();

  const defaultValues = useMemo(() => {
    return {
      name: lead?.name || "",
      companyId: lead?.company?.id || "",
      companyName: lead?.company?.name || "",
      contactPerson: lead?.contactPerson || "",
      email: lead?.company?.email || lead?.email || "",
      phone: lead?.company?.phone || lead?.phone || "",
      status: lead?.status || "New",
      industry: lead?.industry || "",
      estimatedValue: lead?.estimatedValue?.toString() || "",
      leadScore: lead?.leadScore || 0,
      source: lead?.source || "",
      notes: lead?.notes || "",
      assignedToId: lead?.assignedTo?.id || "",
    };
  }, [lead]);

  const form = useForm<LeadFormData>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = (data: LeadFormData) => {
    if (isEditMode && lead) {
      updateLead(
        { id: lead.id, data },
        {
          onSuccess: () => {
            toast.success("Lead updated successfully");
            onSuccess?.();
            onClose?.();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createLead(data, {
        onSuccess: () => {
          toast.success("Lead created successfully");
          form.reset();
          onSuccess?.();
          onClose?.();
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
    isEditMode,
    isSubmitError: isCreateError || isUpdateError,
    submitError: createError || updateError,
  };
};