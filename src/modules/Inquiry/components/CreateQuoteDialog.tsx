import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProduct } from '@/modules/Products/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Calculator, Calendar, FileText, DollarSign, Plus, Trash2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { QuotationFormData, quotationSchema } from '../types';
import { useQuoteMutation } from './hooks/useQuoteMutation';

interface CreateQuotationDialogProps {
  open: boolean;
  onClose: () => void;
  entity: {
    id: string;
    type: "client" | "lead" | "inquiry"
  }
}

export const CreateQuotationDialog: React.FC<CreateQuotationDialogProps> = ({ 
  open, 
  onClose,
  entity
}) => {
  const [autoCalculate, setAutoCalculate] = useState(true);

    const { data: products = [] } = useProduct();

    const quoteMutation = useQuoteMutation({
      onSuccess: () => {
        form.reset()
        toast.success("Quotation successfully created");
        onClose();
      },
      onError: () => {
        form.reset()
        toast.error("Quotation creation failed");
        onClose();
      }
    });

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      fromEntity: {
        id: entity.id,
        entityType: entity.type
      },
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      notesToCustomer: '',
      internalNotes: '',
      items: [
        {
          productId: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          lineTotal: 0,
        }
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const watchedItems = form.watch('items');
  const watchedDiscount = form.watch('discount');
  const watchedTax = form.watch('tax');
  
  useEffect(() => {
    if (autoCalculate) {
      let newSubtotal = 0;
      
      watchedItems.forEach((item, index) => {
        const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
        if (form.getValues(`items.${index}.lineTotal`) !== lineTotal) {
          form.setValue(`items.${index}.lineTotal`, lineTotal, {
            shouldValidate: false,
            shouldDirty: true,
          });
        }
        newSubtotal += lineTotal;
      });
      
      if (form.getValues('subtotal') !== newSubtotal) {
        form.setValue('subtotal', newSubtotal, {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
      
      const total = newSubtotal + (watchedTax || 0) - (watchedDiscount || 0);
      if (form.getValues('total') !== Math.max(0, total)) {
        form.setValue('total', Math.max(0, total), {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
    }
  }, [watchedItems, watchedDiscount, watchedTax, autoCalculate, form]);
  
  
  
  const onSubmit = (data: QuotationFormData) => {
    quoteMutation.mutate({ quotationDetails: data });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };



  const addItem = () => {
    append({
      productId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0,
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleProductSelect = (productId: string, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.description`, product.name);
      form.setValue(`items.${index}.unitPrice`, Number(product.basePrice) || 0);
    }
  };

  const currentSubtotal = form.watch('subtotal') || 0;
  const currentDiscount = form.watch('discount') || 0;
  const currentTax = form.watch('tax') || 0;
  const currentTotal = form.watch('total') || 0;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5" />
            Create Quotation
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Quote Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Quotation Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Valid Until <span className="text-red-500">*</span>
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
            </div>

            <Separator />

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Quotation Items</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {/* Product Selection */}
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => handleProductSelect(value, index)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Item description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="pl-8"
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

                      {/* Line Total */}
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.lineTotal`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Line Total</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="pl-8 font-medium"
                                    disabled={autoCalculate}
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

                      {/* Remove Button */}
                      <div className="md:col-span-1 flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={fields.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Pricing Summary</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount</FormLabel>
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
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Amount</FormLabel>
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

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={autoCalculate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoCalculate(!autoCalculate)}
                    className="text-xs"
                  >
                    {autoCalculate ? "Auto Calculate" : "Manual Mode"}
                  </Button>
                </div>
              </div>

              {/* Price Summary Card */}
              <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">₱{currentSubtotal.toFixed(2)}</span>
                    </div>
                    {currentDiscount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Discount:</span>
                        <span className="font-medium text-green-600">-₱{currentDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {currentTax > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tax:</span>
                        <span className="font-medium">+₱{currentTax.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-lg font-bold text-primary">₱{currentTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Notes</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notesToCustomer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes to Customer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Visible to customer on quotation..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Internal notes (not visible to customer)..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={quoteMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={quoteMutation.isPending || currentTotal <= 0}
                className="min-w-[120px]"
              >
                {quoteMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </div>
                ) : (
                  'Create Quotation'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};