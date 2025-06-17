import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/api/api";
import { LogContactHistoryInput, LogContactHistorySchema, ContactMethodEnum, ContactOutcomeEnum } from "@/types/sharedTypes";
import { EntityType } from "@/types/sharedTypes";
import { Phone, Mail, MessageSquare, Calendar, User, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface LogContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: EntityType;
  onSuccess?: () => void;
}

export const LogContactModal: React.FC<LogContactModalProps> = ({
  isOpen,
  onClose,
  entityId,
  entityType,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<LogContactHistoryInput>({
    resolver: zodResolver(LogContactHistorySchema),
    defaultValues: {
      method: undefined,
      summary: "",
      outcome: undefined,
      timestamp: new Date().toISOString().slice(0, 16),
      entityId: entityId,
      entityType: entityType,
    },
  });

  const { formState: { isSubmitting }, handleSubmit } = form;

  const logContactMutation = useMutation<any, Error, LogContactHistoryInput>({
    mutationFn: async (data) => {

      let url = '';
      switch (entityType) {
        case 'Lead':
          url = `/leads/${entityId}/contact-history`;
          break;
        case 'Inquiry':
          url = `/inquiries/${entityId}/contact-history`;
          break;
        case 'Client':
          url = `/clients/${entityId}/contact-history`;
          break;
        default:
          throw new Error(`Unsupported entity type for contact logging: ${entityType}`);
      }
      const response = await apiClient.post(url, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Contact logged successfully!");
      queryClient.invalidateQueries({ queryKey: ['contactHistory', entityType, entityId] });
      onSuccess?.();
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to log contact: ${error.message}`);
      console.error("Contact log error:", error);
    },
  });

  const onSubmit = useCallback((data: LogContactHistoryInput) => {
    logContactMutation.mutate(data);
  }, [logContactMutation]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        onClose();
        form.reset();
      }
    },
    [onClose, form]
  );

  const getMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'phone':
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'message':
      case 'text':
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome?.toLowerCase()) {
      case 'successful':
      case 'completed':
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'unsuccessful':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'follow-up':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEntityColor = (entityType: EntityType) => {
    switch (entityType) {
      case 'Lead':
        return 'from-blue-500 to-cyan-500';
      case 'Inquiry':
        return 'from-purple-500 to-pink-500';
      case 'Client':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${getEntityColor(entityType)} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-white">
                    Log New Contact
                  </DialogTitle>
                  <p className="text-white/80 text-sm font-medium">
                    {entityType} • ID: {entityId.slice(-8)}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Form content */}
        <div className="p-6">
          <Form {...form}>
            <div onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Method and Outcome in a grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Method
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-white">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-2 border-gray-100 shadow-lg">
                          {ContactMethodEnum.map((method) => (
                            <SelectItem
                              key={method}
                              value={method}
                              className="flex items-center gap-2 hover:bg-gray-50 cursor-pointer py-3"
                            >
                              <div className="flex items-center gap-2">
                                {getMethodIcon(method)}
                                <span>{method}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Outcome
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-white">
                            <SelectValue placeholder="Select outcome (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-2 border-gray-100 shadow-lg">
                          <SelectItem value="none" className="hover:bg-gray-50 cursor-pointer py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4"></div>
                              <span>None</span>
                            </div>
                          </SelectItem>
                          {ContactOutcomeEnum.map((outcome) => (
                            <SelectItem
                              key={outcome}
                              value={outcome}
                              className="flex items-center gap-2 hover:bg-gray-50 cursor-pointer py-3"
                            >
                              <div className="flex items-center gap-2">
                                {getOutcomeIcon(outcome)}
                                <span>{outcome}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date & Time */}
              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date & Time
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? field.value.slice(0, 16) : ''}
                          className="h-11 border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-white pl-4"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Summary
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details of the contact interaction..."
                        rows={4}
                        {...field}
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-white resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Action buttons */}
              <DialogFooter className="gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="px-6 py-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className={`px-6 py-2 bg-gradient-to-r ${getEntityColor(entityType)} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white font-semibold disabled:transform-none disabled:hover:shadow-none`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Log Contact</span>
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};