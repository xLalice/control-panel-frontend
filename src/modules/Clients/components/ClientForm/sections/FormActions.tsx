import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Plus, X, Save } from "lucide-react";
import { FormMode } from "../client.schema";

interface FormActionsProps {
  mode: FormMode;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onEdit?: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  mode,
  isSubmitting,
  onCancel,
  onSubmit,
  onEdit,
}) => {
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  return (
    <DialogFooter className="gap-3 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Close"
      </Button>

      {onEdit && (
        <Button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Client
        </Button>
      )}

    
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[140px] flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {isCreateMode ? (
                <Plus className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditMode ? "Update Client" : "Create Client"}
            </>
          )}
        </Button>
    </DialogFooter>
  );
};
