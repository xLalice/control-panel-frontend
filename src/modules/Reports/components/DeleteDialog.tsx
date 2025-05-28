import { Button } from "@/components/ui/button";
import { Report } from "@/types";

interface DeleteDialogProps {
  report: Report | null;
  onDelete: (id: string) => void;
}

export default function DeleteDialog({ report, onDelete }: DeleteDialogProps) {
  if (!report) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Are you sure?</h3>
      <p>Do you want to delete the report for {report.department} on {new Date(report.date).toLocaleDateString()}?</p>
      <div className="flex justify-end space-x-4">
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive" onClick={() => onDelete(report.id)}>Delete</Button>
      </div>
    </div>
  );
}
