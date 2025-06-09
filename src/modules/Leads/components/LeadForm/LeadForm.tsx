import { Plus } from "lucide-react";
import { LeadFormProps } from "../../types/leads.types";
import { Dialog, DialogTrigger, Button } from "@/components/ui";
import { LeadFormContent } from "./LeadFormContent";
import { useState } from "react";

const LeadForm = ({ lead, onSuccess, onClose, users }: LeadFormProps) => {
  const isEditMode = !!lead;
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
    if (!newOpenState && !isEditMode) {
      onClose?.();
    }
  };

  return isEditMode ? (
    <Dialog open={true} onOpenChange={(open) => !open && onClose?.()}>
      <LeadFormContent
        lead={lead}
        users={users}
        onSuccess={onSuccess}
        onClose={onClose}
      />
    </Dialog>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-yellow-500 hover:scale-110 hover:bg-yellow-600 text-black h-8 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          Create Lead
        </Button>
      </DialogTrigger>
      <LeadFormContent users={users} onSuccess={onSuccess} onClose={onClose} />
    </Dialog>
  );
};

export default LeadForm;
