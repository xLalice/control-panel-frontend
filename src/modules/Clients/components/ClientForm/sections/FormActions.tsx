import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void | undefined;
  onSubmit: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isEditMode,
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <DialogFooter className="gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{isEditMode ? "Update Client" : "Create Client"}</>
        )}
      </Button>
    </DialogFooter>
  );
};