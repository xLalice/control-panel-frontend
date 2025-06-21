import { Plus } from "lucide-react";
import { LeadFormProps } from "../../types/leads.types";
import { Dialog, Button } from "@/components/ui";
import { LeadFormContent } from "./LeadFormContent";
import { toast } from "react-toastify";
import { useLeadsTable } from "../../hooks/useLeadsTable";

const LeadForm = ({ lead, isOpen, onClose, onOpenChange }: LeadFormProps) => {
  const isEditMode = !!lead;
  const { refetchLeads } = useLeadsTable();

  const handleLeadFormSuccess = () => {
    console.log("handleLeadFormSuccess called");
    toast.success(
      isEditMode ? "Lead updated successfully!" : "Lead created successfully!"
    );
    if (refetchLeads) {
      refetchLeads();
    }
    onClose();
  };

  const handleButtonClick = () => {
    onOpenChange(true);
  };

  return (
    <>
      <Button
        className="ml-auto bg-yellow-500 hover:scale-110 hover:bg-yellow-600 text-black h-8 text-xs"
        onClick={handleButtonClick}
      >
        <Plus className="w-3 h-3 mr-1" />
        {isEditMode ? "Edit" : "Create"} Lead
      </Button>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <LeadFormContent
          lead={lead}
          onSuccess={handleLeadFormSuccess}
          onClose={onClose}
        />
      </Dialog>
    </>
  );
};

export default LeadForm;
