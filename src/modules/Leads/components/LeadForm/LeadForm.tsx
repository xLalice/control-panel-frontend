import { Plus } from "lucide-react";
import { LeadFormProps } from "../../types/leads.types";
import { Dialog, DialogTrigger, Button } from "@/components/ui";
import { LeadFormContent } from "./LeadFormContent";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLeadsTable } from "../../hooks/useLeadsTable";

const LeadForm = ({ lead, users }: LeadFormProps) => {
  const isEditMode = !!lead;
  const [isOpen, setIsOpen] = useState(false);
  const { refetchLeads } = useLeadsTable();

  const handleOpenChange = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
  };

  const handleLeadFormSuccess = () => {
    toast.success(
      isEditMode ? "Lead updated successfully!" : "Lead created successfully!"
    );
    setIsOpen(false);
    if (refetchLeads) {
      refetchLeads();
    }
  };

  const handleLeadFormClose = () => {
    setIsOpen(false);
  };

  return isEditMode ? (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <LeadFormContent
        lead={lead}
        users={users}
        onSuccess={handleLeadFormSuccess}
        onClose={handleLeadFormClose}
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
      <LeadFormContent
        users={users}
        onSuccess={handleLeadFormSuccess}
        onClose={handleLeadFormClose}
      />
    </Dialog>
  );
};

export default LeadForm;
