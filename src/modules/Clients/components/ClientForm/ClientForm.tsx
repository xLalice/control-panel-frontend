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
import { ClientFullData } from "./client.schema";


type FormMode = "create" | "edit";

interface ClientFormProps {
  client?: ClientFullData;
  mode?: FormMode;
  onSuccess?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  mode = "create",
  onSuccess,
  onClose,
  isOpen,
  setIsOpen,
}) => {
  const { form, isSubmitting, onSubmit, copyBillingToShipping } =
    useClientForm({
      client: client || undefined,
      onSuccess: () => {
        onSuccess?.();
      },
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
    [onClose, form, setIsOpen]
  );

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return "Create New Client";
      case 'edit':
        return "Update Client";
      default:
        return "Client";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="border-t pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicInfoSection
                control={form.control}
                isViewMode={false}
              />
             
              <div className="border-t pt-6">
                <AddressSection
                  control={form.control}
                  title="Billing Address"
                  prefix="billing"
                  isViewMode={false}
                />
              </div>
             
              <div className="border-t pt-6">
                <AddressSection
                  control={form.control}
                  title="Shipping Address"
                  prefix="shipping"
                  showCopyButton={true}
                  onCopyClick={copyBillingToShipping}
                  isViewMode={false}
                />
              </div>
             
              <div className="border-t pt-6">
                <NotesSection
                  control={form.control}
                  isViewMode={false}
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
        />
      </DialogContent>
    </Dialog>
  );
};