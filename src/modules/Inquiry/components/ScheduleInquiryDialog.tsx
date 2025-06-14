import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from './ui/DatePicker'; // Assuming this component exists
import { scheduleInquiry } from '@/api/api';
import { toast } from 'react-toastify';
import { Calendar, Clock, AlertCircle, CheckCircle2, CalendarPlus, MessageSquare } from 'lucide-react';

interface ScheduleInquiryDialogProps {
  open: boolean;
  onClose: () => void;
  inquiryId: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const priorityLevels = [
  { value: 'low', label: 'Low Priority', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-200 text-red-900' }
];

export const ScheduleInquiryDialog: React.FC<ScheduleInquiryDialogProps> = ({ 
  open, 
  onClose, 
  inquiryId 
}) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [notes, setNotes] = useState<string>('');
  const [reminderMinutes, setReminderMinutes] = useState<number>(30);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedDate(null);
      setSelectedTime('');
      setPriority('medium');
      setNotes('');
      setReminderMinutes(30);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: (scheduledDate: Date) => scheduleInquiry(inquiryId, scheduledDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onClose();
      toast.success('🎉 Inquiry scheduled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule inquiry');
    },
  });

  const handleConfirm = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (!selectedTime) {
      toast.error('Please select a time');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    if (scheduledDateTime < new Date()) {
      toast.error('Cannot schedule for past date/time');
      return;
    }

    mutation.mutate(scheduledDateTime);
  };

  const isFormValid = selectedDate && selectedTime;
  const scheduledDateTime = selectedDate && selectedTime ? 
    (() => {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const dt = new Date(selectedDate);
      dt.setHours(hours, minutes, 0, 0);
      return dt;
    })() : null;

  const isPastDateTime = scheduledDateTime && scheduledDateTime < new Date();
  const selectedPriority = priorityLevels.find(p => p.value === priority);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarPlus className="h-5 w-5" />
            Schedule Inquiry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Date & Time
              </CardTitle>
              <CardDescription>
                Choose when you'd like to follow up on this inquiry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <DatePicker 
                    date={selectedDate} 
                    setDate={setSelectedDate}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Select Time
                  </Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time} ({new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {scheduledDateTime && (
                <div className="mt-4">
                  <Card className={`${isPastDateTime ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {isPastDateTime ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        <div>
                          <p className={`font-medium ${isPastDateTime ? 'text-red-700' : 'text-green-700'}`}>
                            Scheduled for: {scheduledDateTime.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} at {scheduledDateTime.toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                          {isPastDateTime && (
                            <p className="text-sm text-red-600">
                              This date/time is in the past. Please select a future date/time.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority and Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority & Settings</CardTitle>
              <CardDescription>
                Set the priority level and reminder preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={level.color} variant="secondary">
                              {level.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPriority && (
                    <Badge className={selectedPriority.color} variant="secondary">
                      {selectedPriority.label}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Reminder (minutes before)</Label>
                  <Select 
                    value={reminderMinutes.toString()} 
                    onValueChange={(value) => setReminderMinutes(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="1440">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-4 w-4" />
                Additional Notes
              </CardTitle>
              <CardDescription>
                Add any specific details or reminders for this scheduled follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Follow up on pricing discussion, send revised proposal, check on decision timeline..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={mutation.isPending || !isFormValid || !!isPastDateTime}
              className="min-w-[120px]"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Scheduling...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};