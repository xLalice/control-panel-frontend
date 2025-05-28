import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from './ui/DatePicker'; // Assuming this component exists
import { scheduleInquiry } from '@/api/api';
import { toast } from 'react-toastify';

interface ScheduleInquiryDialogProps {
  open: boolean;
  onClose: () => void;
  inquiryId: string;
}

export const ScheduleInquiryDialog: React.FC<ScheduleInquiryDialogProps> = ({ open, onClose, inquiryId }) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const mutation = useMutation({
    mutationFn: (scheduledDate: Date) => scheduleInquiry(inquiryId, scheduledDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onClose();
      toast.success('Inquiry scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule inquiry');
    },
  });

  const handleConfirm = () => {
    if (selectedDate) {
      mutation.mutate(selectedDate);
    } else {
      toast.error('Please select a date');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Inquiry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={mutation.isPending || !selectedDate}>
              {mutation.isPending ? 'Scheduling...' : 'Schedule'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};