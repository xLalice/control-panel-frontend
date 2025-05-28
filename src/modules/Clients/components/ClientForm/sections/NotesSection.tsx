import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ClientFormInput } from "../client.schema";

interface NotesSectionProps {
  control: Control<ClientFormInput>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional notes about the client"
                className="min-h-[100px] resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// components/ClientForm/FormActions.tsx
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
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