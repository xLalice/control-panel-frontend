import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAttendance } from "../hooks/useAttendance";

interface BreakModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BreakModal: React.FC<BreakModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [reason, setReason] = useState("");
  const { useStartBreakMutation } = useAttendance();
  const startBreakMutation = useStartBreakMutation();

  const handleStartBreak = () => {
    startBreakMutation.mutate(reason, {
      onSuccess: () => {
        setReason("");
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Break</DialogTitle>
          <DialogDescription>
            Please enter a reason for your break (optional).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Lunch break, Meeting, etc."
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStartBreak}
            disabled={startBreakMutation.isPending}
          >
            {startBreakMutation.isPending ? "Starting..." : "Start Break"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
