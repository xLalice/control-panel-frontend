import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createQuote } from '@/api/api';
import { toast } from 'react-toastify';

const quoteSchema = z.object({
  basePrice: z.number().min(0, "Base price must be a positive number"),
  deliveryFee: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  taxes: z.number().min(0).optional(),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
  validUntil: z.date().optional(),
  notes: z.string().optional(),
});

// Infer the type from schema
type QuoteFormData = z.infer<typeof quoteSchema>;

interface CreateQuoteDialogProps {
  open: boolean;
  onClose: () => void;
  inquiryId: string;
}

export const CreateQuoteDialog: React.FC<CreateQuoteDialogProps> = ({ open, onClose, inquiryId }) => {
  const queryClient = useQueryClient();
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      basePrice: 0,
      totalPrice: 0,
      notes: '',
    },
  });
  
  const mutation = useMutation({
    mutationFn: (quoteDetails: QuoteFormData) => createQuote(inquiryId, quoteDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onClose();
      toast.success('Quote created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create quote');
    },
  });
  
  const onSubmit = (data: QuoteFormData) => {
    mutation.mutate(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter base price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Fee (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter delivery fee"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxes (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter taxes"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Quote'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};