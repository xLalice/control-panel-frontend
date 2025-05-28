import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useClientForm } from "./client.hook";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { AddressSection } from "./sections/AddressSection";
import { NotesSection } from "./sections/NotesSection";
import { FormActions } from "./sections/FormActions";
import { ClientFormInput } from "./client.schema";

interface ClientFormProps {
  client?: ClientFormInput;
  onSuccess?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSuccess,
  onClose,
  isOpen,
  setIsOpen
}) => {
  const {
    form,
    isEditMode,
    isSubmitting,
    onSubmit,
    copyBillingToShipping,
  } = useClientForm({
    client,
    onSuccess: () => {
      onSuccess?.();
    },
    onClose,
  });

  const handleSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setIsOpen?.(newOpen);
    if (!newOpen) {
      onClose?.();
      form.reset();
    }
  }, [onClose, form]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Client" : "Create New Client"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update the client information. Required fields are marked with *."
              : "Enter the client details. Fill in all required fields marked with *."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoSection control={form.control} />
           
            <AddressSection
              control={form.control}
              title="Billing Address"
              prefix="billing"
            />
           
            <AddressSection
              control={form.control}
              title="Shipping Address"
              prefix="shipping"
              showCopyButton
              onCopyClick={copyBillingToShipping}
            />
           
            <NotesSection control={form.control} />
          </form>
        </Form>
        <FormActions
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};