import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createInquiry, checkCustomerExists } from '@/api/api';
import { DatePicker } from './ui/DatePicker';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState, useEffect } from 'react';
import { Inquiry, CreateInquiryDto, DeliveryMethod, ReferenceSource } from "../types";
import { InquiryContactResponse } from '@/api/api';
import { useDebounce } from 'use-debounce'; 


const formSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  isCompany: z.boolean().default(false),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  productType: z.string().min(1, { message: "Please select a product type." }),
  quantity: z.number().positive({ message: "Quantity must be positive." }),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  deliveryLocation: z.string().min(1, { message: "Please enter a delivery location." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
  referenceSource: z.nativeEnum(ReferenceSource),
  remarks: z.string().optional(),
  relatedLeadId: z.string().optional(), 
});

type AddInquiryFormProps = {
  onInquiryAdded?: () => void;
};

export const AddInquiryForm: React.FC<AddInquiryFormProps> = ({ onInquiryAdded }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      email: "",
      isCompany: false,
      companyName: "",
      companyAddress: "",
      productType: "",
      quantity: 1,
      deliveryMethod: DeliveryMethod.Delivery,
      deliveryLocation: "",
      preferredDate: new Date(),
      referenceSource: ReferenceSource.other,
      remarks: "",
      relatedLeadId: "",
    },
  });

  const [existingCustomer, setExistingCustomer] = useState<InquiryContactResponse | null>(null);

  // Watch form values for debouncing
  const email = form.watch("email");
  const phoneNumber = form.watch("phoneNumber");
  const companyName = form.watch("companyName");

  // Debounce input values to avoid excessive API calls
  const [debouncedEmail] = useDebounce(email, 500);
  const [debouncedPhoneNumber] = useDebounce(phoneNumber, 500);
  const [debouncedCompanyName] = useDebounce(companyName, 500);

  // Check customer existence with useQuery
  const { data: customerData, isLoading: isCheckingCustomer } = useQuery({
    queryKey: ['checkCustomer', debouncedEmail, debouncedPhoneNumber, debouncedCompanyName],
    queryFn: () => checkCustomerExists({
      email: debouncedEmail,
      phoneNumber: debouncedPhoneNumber,
      companyName: debouncedCompanyName,
    }),
    enabled: !!(debouncedEmail || debouncedPhoneNumber || debouncedCompanyName), // Only run if at least one field has a value
  });

  // Update form with existing customer data
  useEffect(() => {
    if (customerData) {
      setExistingCustomer(customerData);
      if (customerData.lead?.id) {
        form.setValue('relatedLeadId', customerData.lead.id); // Link to existing lead
      }
    }
  }, [customerData, form]);

  const mutation = useMutation<Inquiry, Error, CreateInquiryDto>({
    mutationFn: createInquiry,
    onSuccess: () => {
      toast.success("Inquiry added successfully!");
      form.reset();
      setExistingCustomer(null);
      if (onInquiryAdded) onInquiryAdded();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add inquiry: ${error.message}`);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  const isCompany = form.watch("isCompany");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Inquiry</CardTitle>
        <CardDescription>Enter the details of the customer inquiry.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isCompany"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This is a company inquiry</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {isCompany && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Display Existing Customer Information */}
            {existingCustomer?.exists && (
              <div className="space-y-4 p-4 bg-yellow-50 rounded-md">
                <h3 className="text-lg font-medium text-yellow-800">Existing Customer Found</h3>
                {existingCustomer.lead && (
                  <div>
                    <p>Matching Lead Found:</p>
                    <ul className="list-disc pl-5">
                      <li>Contact: {existingCustomer.lead.contactPerson}</li>
                      <li>Email: {existingCustomer.lead.email}</li>
                      <li>Phone: {existingCustomer.lead.phone}</li>
                      <li>Company: {existingCustomer.lead.company?.name}</li>
                      <li>Status: {existingCustomer.lead.status}</li>
                    </ul>
                    <p className="mt-2 text-sm">
                      This inquiry will be linked to the existing lead (ID: {existingCustomer.lead.id})
                    </p>
                  </div>
                )}
                {existingCustomer.company && !existingCustomer.lead && (
                  <p>Matching Company: {existingCustomer.company.name}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order Request</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TypeA">Type A</SelectItem>
                          <SelectItem value="TypeB">Type B</SelectItem>
                          <SelectItem value="TypeC">Type C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Delivery/Pickup Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hauling Method*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hauling method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={DeliveryMethod.Delivery}>Delivery</SelectItem>
                          <SelectItem value={DeliveryMethod.Pickup}>Pickup</SelectItem>
                          <SelectItem value={DeliveryMethod.ThirdParty}>Third-party Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter delivery/pickup location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date*</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} setDate={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referenceSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Source*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How did they find us?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Tiktok">TikTok</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Flyers">Flyers</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional notes or comments"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional information or special requests from the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={mutation.isPending || isCheckingCustomer}>
                {mutation.isPending ? "Submitting..." : "Add Inquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};