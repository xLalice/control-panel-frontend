import { Plus } from "lucide-react";
import { LeadFormProps } from "../../types/leads.types";
import { Dialog, DialogTrigger, Button } from "@/components/ui";
import { LeadFormContent } from "./LeadFormContent";
import { toast } from "react-toastify";
import { useLeadsTable } from "../../hooks/useLeadsTable";

const LeadForm = ({ lead, users, isOpen, onClose }: LeadFormProps) => {
  const isEditMode = !!lead;
  const { refetchLeads } = useLeadsTable();

  const handleLeadFormSuccess = () => {
    toast.success(
      isEditMode ? "Lead updated successfully!" : "Lead created successfully!"
    );
    if (refetchLeads) {
      refetchLeads();
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="ml-auto bg-yellow-500 hover:scale-110 hover:bg-yellow-600 text-black h-8 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Create Lead
          </Button>
        </DialogTrigger>
      )}

      <LeadFormContent
        lead={lead}
        users={users}
        onSuccess={handleLeadFormSuccess}
        onClose={onClose}
      />
    </Dialog>
  );
};

export default LeadForm;
