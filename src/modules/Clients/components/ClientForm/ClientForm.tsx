import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useClientForm } from "./client.hook";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { AddressSection } from "./sections/AddressSection";
import { NotesSection } from "./sections/NotesSection";
import { FormActions } from "./sections/FormActions";
import { Badge } from "@/components/ui/badge";
import { ClientFormInput, FormMode } from "./client.schema";

interface ClientFormProps {
  client?: ClientFormInput;
  mode?: FormMode;
  onSuccess?: () => void;
  onClose?: () => void;
  onEdit?: () => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  mode = "create",
  onSuccess,
  onClose,
  onEdit,
  isOpen,
  setIsOpen,
}) => {
  const { form, isSubmitting, onSubmit, copyBillingToShipping } =
    useClientForm({
      client: client || undefined,
      onSuccess: () => {
        onSuccess?.();
      },
      onClose,
    });

  const handleSubmit = useCallback(() => {
    console.log("Form submitted");
    onSubmit(form.getValues());
  }, [form, onSubmit]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setIsOpen?.(newOpen);
      if (!newOpen) {
        onClose?.();
        form.reset();
      }
    },
    [onClose, form]
  );

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return "Create New Client";
      case 'edit':
        return "Update Client";
      case 'view':
        return "Client Details";
      default:
        return "Client";
    }
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {getDialogTitle()}
            </DialogTitle>
            {client && isViewMode && (
              <Badge 
                variant={client.status === 'Active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {client.status}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="border-t pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicInfoSection 
                control={form.control} 
                isViewMode={isViewMode}
              />
              
              <div className="border-t pt-6">
                <AddressSection
                  control={form.control}
                  title="Billing Address"
                  prefix="billing"
                  isViewMode={isViewMode}
                />
              </div>
              
              <div className="border-t pt-6">
                <AddressSection
                  control={form.control}
                  title="Shipping Address"
                  prefix="shipping"
                  showCopyButton={!isViewMode}
                  onCopyClick={copyBillingToShipping}
                  isViewMode={isViewMode}
                />
              </div>
              
              <div className="border-t pt-6">
                <NotesSection 
                  control={form.control} 
                  isViewMode={isViewMode}
                />
              </div>
            </form>
          </Form>
        </div>

        <FormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleSubmit}
          onEdit={onEdit}
        />
      </DialogContent>
    </Dialog>
  );
};