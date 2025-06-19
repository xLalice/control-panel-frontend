import { z } from "zod";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  CardContent,
  Input,
  Checkbox,
  Alert,
  AlertDescription,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Button,
} from "@/components/ui";
import React, { useState, useEffect } from "react";
import {
  DeliveryMethod,
  ReferenceSource,
  InquiryType,
  Priority,
  formSchema,
} from "../types";
import { InquiryContactResponse } from "@/api/api";
import { useDebounce } from "use-debounce";
import {
  User,
  Building2,
  Package,
  Truck,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Star,
  ShoppingCart,
  Trash2, // Fixed: Added missing import
  Plus,   // Fixed: Added missing import
} from "lucide-react";
import { DatePicker } from "../components/ui/DatePicker";
import { getPriorityColor } from "../inquiry.utils";
import { useInquiryForm } from "./hooks/useInquiryForm";
import { useCreateInquiryMutation } from "./hooks/useCreateInquiryMutation";
import { useProduct } from "@/modules/Products/hooks/useProducts";
import { useFieldArray } from "react-hook-form";
import { useCheckCustomer } from "./hooks/useCheckCustomer";

type AddInquiryFormProps = {
  onInquiryAdded?: () => void;
};

export const AddInquiryForm: React.FC<AddInquiryFormProps> = ({
  onInquiryAdded,
}) => {
  const [existingCustomer, setExistingCustomer] =
    useState<InquiryContactResponse | null>(null);
  const { form } = useInquiryForm();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const email = form.watch("email");
  const phoneNumber = form.watch("phoneNumber");
  const companyName = form.watch("companyName");
  const priority = form.watch("priority");
  const isCompany = form.watch("isCompany");

  const [debouncedEmail] = useDebounce(email, 500);
  const [debouncedPhoneNumber] = useDebounce(phoneNumber, 500);
  const [debouncedCompanyName] = useDebounce(companyName, 500);

  const { data: customerData, isLoading } = useCheckCustomer({
    debouncedEmail,
    debouncedPhoneNumber,
    debouncedCompanyName,
  });

  const { data: products } = useProduct();

  useEffect(() => {
    if (customerData) {
      setExistingCustomer(customerData);
      if (customerData.lead?.id) {
        form.setValue("relatedLeadId", customerData.lead.id);
      }
    }
  }, [customerData, form]);

  const createInquiryMutation = useCreateInquiryMutation({
    onSuccess: () => {
      toast.success("Inquiry added successfully!");
      form.reset();
      setExistingCustomer(null);
      if (onInquiryAdded) onInquiryAdded();
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createInquiryMutation.mutate(data);
  };

  const addNewItem = () => {
    append({
      productId: "",
      quantity: 1,
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.warning("At least one item is required");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                New Customer Inquiry
              </CardTitle>
              <CardDescription className="text-blue-100">
                Capture and manage customer requests with ease
              </CardDescription>
            </div>
          </div>
          {priority && (
            <div className="mt-4">
              <Badge className={`${getPriorityColor(priority)} font-medium`}>
                <Star className="h-3 w-3 mr-1" />
                {priority} Priority
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Customer Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Basic contact details and preferences
                    </p>
                  </div>
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 ml-auto" />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Customer Name*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isCompany"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            This is a company inquiry
                          </FormLabel>
                          <FormDescription className="text-xs text-gray-500">
                            Check if this inquiry is from a business
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Company Information Section */}
              {isCompany && (
                <div className="space-y-6 p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Company Information
                      </h3>
                      <p className="text-sm text-gray-600">
                        Business details and location
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter company name"
                              className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
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
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Company Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter company address"
                              className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Existing Customer Alert */}
              {existingCustomer?.exists && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">
                          Existing Customer Found
                        </span>
                      </div>
                      {existingCustomer.lead && (
                        <div className="bg-white p-4 rounded-lg border border-amber-200">
                          <p className="font-medium text-amber-900 mb-2">
                            Matching Lead Information:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <strong>Contact:</strong>{" "}
                              {existingCustomer.lead.contactPerson}
                            </div>
                            <div>
                              <strong>Email:</strong>{" "}
                              {existingCustomer.lead.email}
                            </div>
                            <div>
                              <strong>Phone:</strong>{" "}
                              {existingCustomer.lead.phone}
                            </div>
                            <div>
                              <strong>Company:</strong>{" "}
                              {existingCustomer.lead.company?.name}
                            </div>
                            <div>
                              <strong>Status:</strong>
                              <Badge variant="outline" className="ml-2">
                                {existingCustomer.lead.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-amber-700 mt-3 p-2 bg-amber-100 rounded">
                            This inquiry will be automatically linked to Lead
                            ID: {existingCustomer.lead.id}
                          </p>
                        </div>
                      )}
                      {existingCustomer.company && !existingCustomer.lead && (
                        <p className="text-amber-800">
                          <strong>Matching Company:</strong>{" "}
                          {existingCustomer.company.name}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Separator className="my-8" />

              {/* Order Items Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order Items
                      </h3>
                      <p className="text-sm text-gray-600">
                        Products and quantities requested
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {fields.length} item{fields.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-6 bg-green-50/30 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <h4 className="font-medium text-gray-900">
                            Item {index + 1}
                          </h4>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Product/Service*
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {products?.map((product) => (
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

                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Quantity*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="Enter quantity"
                                  className="h-11 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Only include fields that exist in your form schema */}
                      {/* Remove the unitPrice, specifications, and notes fields if they're not in your schema */}
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNewItem}
                    className="h-11 px-6 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Item
                  </Button>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Inquiry Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Inquiry Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Type and priority information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Inquiry Type*
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={InquiryType.PricingRequest}>
                              💰 Pricing Request
                            </SelectItem>
                            <SelectItem value={InquiryType.ProductAvailability}>
                              📦 Product Availability
                            </SelectItem>
                            <SelectItem value={InquiryType.TechnicalQuestion}>
                              🔧 Technical Question
                            </SelectItem>
                            <SelectItem value={InquiryType.DeliveryInquiry}>
                              🚚 Delivery Inquiry
                            </SelectItem>
                            <SelectItem value={InquiryType.Other}>
                              ❓ Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Priority Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Priority.Low}>🔵 Low</SelectItem>
                            <SelectItem value={Priority.Medium}>
                              🟡 Medium
                            </SelectItem>
                            <SelectItem value={Priority.High}>
                              🟠 High
                            </SelectItem>
                            <SelectItem value={Priority.Urgent}>
                              🔴 Urgent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Delivery/Pickup Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Delivery & Logistics
                    </h3>
                    <p className="text-sm text-gray-600">
                      Shipping and timing preferences
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Delivery Method
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Select hauling method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={DeliveryMethod.Delivery}>
                              🚚 Delivery
                            </SelectItem>
                            <SelectItem value={DeliveryMethod.Pickup}>
                              📦 Pickup
                            </SelectItem>
                            <SelectItem value={DeliveryMethod.ThirdParty}>
                              🚛 Third-party Logistics
                            </SelectItem>
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
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter delivery/pickup location"
                            className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          Preferred Date*
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          How did they find us?*
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Select reference source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ReferenceSource.Facebook}>
                              📘 Facebook
                            </SelectItem>
                            <SelectItem value={ReferenceSource.Instagram}>
                              📸 Instagram
                            </SelectItem>
                            <SelectItem value={ReferenceSource.TikTok}>
                              🎵 TikTok
                            </SelectItem>
                            <SelectItem value={ReferenceSource.Referral}>
                              👥 Referral
                            </SelectItem>
                            <SelectItem value={ReferenceSource.Flyers}>
                              📄 Flyers
                            </SelectItem>
                            <SelectItem value={ReferenceSource.Other}>
                              ❓ Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Additional Notes Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Additional Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Notes and special requests
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Remarks & Special Requests
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter additional notes, special requirements, or customer comments..."
                          className="min-h-32 border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-500">
                        Any additional information that might be helpful for
                        processing this inquiry.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={createInquiryMutation.isPending || isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createInquiryMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Inquiry
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
