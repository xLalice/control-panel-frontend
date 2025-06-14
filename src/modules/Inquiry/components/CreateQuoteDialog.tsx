import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { createQuote } from '@/api/api';
import { toast } from 'react-toastify';
import { Calculator, Calendar, FileText, DollarSign, Truck, Tag, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';

const quoteSchema = z.object({
  basePrice: z.number().min(0, "Base price must be a positive number"),
  deliveryFee: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  taxes: z.number().min(0).optional(),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
  validUntil: z.date().optional(),
  notes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface CreateQuoteDialogProps {
  open: boolean;
  onClose: () => void;
  inquiryId: string;
}

export const CreateQuoteDialog: React.FC<CreateQuoteDialogProps> = ({ open, onClose, inquiryId }) => {
  const queryClient = useQueryClient();
  const [autoCalculate, setAutoCalculate] = useState(true);
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      basePrice: 0,
      deliveryFee: 0,
      discount: 0,
      taxes: 0,
      totalPrice: 0,
      notes: '',
    },
  });
  
  const watchedValues = form.watch(['basePrice', 'deliveryFee', 'discount', 'taxes']);
  
  useEffect(() => {
    if (autoCalculate) {
      const [basePrice, deliveryFee, discount, taxes] = watchedValues;
      const calculatedTotal = (basePrice || 0) + (deliveryFee || 0) + (taxes || 0) - (discount || 0);
      if (form.getValues('totalPrice') !== Math.max(0, calculatedTotal)) {
      form.setValue('totalPrice', Math.max(0, calculatedTotal), {
        shouldValidate: false, 
        shouldDirty: true,    
      });
    }
    }
  }, [watchedValues, autoCalculate, form]);
  
  const mutation = useMutation({
    mutationFn: (quoteDetails: QuoteFormData) => createQuote(inquiryId, quoteDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      form.reset();
      onClose();
      toast.success('Quote created successfully! 🎉');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create quote');
    },
  });
  
  const onSubmit = (data: QuoteFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const currentTotal = form.watch('totalPrice') || 0;
  const basePrice = form.watch('basePrice') || 0;
  const deliveryFee = form.watch('deliveryFee') || 0;
  const discount = form.watch('discount') || 0;
  const taxes = form.watch('taxes') || 0;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5" />
            Create Quote
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Pricing Details</h3>
              </div>
              
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Base Price <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8 text-lg font-medium"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Additional Costs</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Truck className="h-3 w-3" />
                        Delivery Fee
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          />
                        </div>
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
                      <FormLabel className="flex items-center gap-2">
                        <Receipt className="h-3 w-3" />
                        Taxes
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          />
                        </div>
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
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        Discount
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Price Calculation Summary */}
            <Card className="bg-slate-50 dark:bg-slate-900/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Base Price:</span>
                    <span className="font-medium">₱{basePrice.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Delivery Fee:</span>
                      <span className="font-medium">+₱{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {taxes > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Taxes:</span>
                      <span className="font-medium">+₱{taxes.toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Discount:</span>
                      <span className="font-medium text-green-600">-₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Calculated Total:</span>
                    <span className="text-lg font-bold text-primary">₱{(basePrice + deliveryFee + taxes - discount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Price Field */}
            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Final Total Price <span className="text-red-500">*</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={autoCalculate ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutoCalculate(!autoCalculate)}
                        className="text-xs"
                      >
                        {autoCalculate ? "Auto" : "Manual"}
                      </Button>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 text-xl font-bold"
                        disabled={autoCalculate}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {autoCalculate && (
                    <p className="text-xs text-muted-foreground">
                      Total is automatically calculated. Toggle to manual mode to edit directly.
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Separator />

            {/* Quote Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Quote Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Valid Until
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-end">
                  {form.watch('validUntil') && (
                    <Badge variant="outline" className="mb-2">
                      Expires: {new Date(form.watch('validUntil')!).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Include any special terms, conditions, or additional details..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending || currentTotal <= 0}
                className="min-w-[120px]"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </div>
                ) : (
                  'Create Quote'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};