import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { ClientCreateInput } from "../client.schema";

interface NotesSectionProps {
  control: Control<ClientCreateInput>;
  isViewMode?: boolean;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  control,
  isViewMode = false 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Additional Notes</h3>
      </div>
      
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">
              Notes
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={isViewMode ? "No notes provided" : "Enter any additional notes about the client"}
                className={`min-h-[120px] resize-none ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                {...field}
                value={field.value || ""}
                readOnly={isViewMode}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};