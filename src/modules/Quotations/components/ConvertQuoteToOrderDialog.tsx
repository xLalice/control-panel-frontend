import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import { Quotation } from "../quotes.types";
import { formatCurrency } from "@/utils/currency";
import { toast } from "react-toastify";

const formSchema = z.object({
    deliveryDate: z.date({
        required_error: "A delivery date is required.",
    }),
    deliveryAddress: z.string().min(5, {
        message: "Delivery address is required (min 5 chars).",
    }),
    paymentTerms: z.string().min(2, {
        message: "Payment terms are required (e.g. COD, 30 Days).",
    }),
    notes: z.string().optional(),
});

interface ConvertQuoteToOrderDialogProps {
    open: boolean;
    onClose: () => void;
    quotation: Quotation;
}

export const ConvertQuoteToOrderDialog = ({
    open,
    onClose,
    quotation,
}: ConvertQuoteToOrderDialogProps) => {
    const { mutate: createOrder, isPending } = useCreateSalesOrder();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deliveryAddress: "",
            paymentTerms: "Cash on Delivery",
            notes: "",
        },
    });

    useEffect(() => {
        if (open && quotation) {
            let defaultAddress = "";

            if (quotation.client) {
                const shippingParts = [
                    quotation.client.shippingAddressStreet,
                    quotation.client.shippingAddressCity,
                    quotation.client.shippingAddressRegion
                ].filter(Boolean); 

                if (shippingParts.length > 0) {
                    defaultAddress = shippingParts.join(", ");
                } else {
                    const billingParts = [
                        quotation.client.billingAddressStreet,
                        quotation.client.billingAddressCity,
                        quotation.client.billingAddressRegion
                    ].filter(Boolean);

                    defaultAddress = billingParts.join(", ");
                }
            }
            else if (quotation.lead) {
                defaultAddress = quotation.lead.company?.name || "";
            }

            form.setValue("deliveryAddress", defaultAddress);
        }
    }, [open, quotation, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {

        const payload = {
            quotationId: quotation.id,
            clientId: quotation.clientId,
            deliveryDate: values.deliveryDate,
            deliveryAddress: values.deliveryAddress,
            paymentTerms: values.paymentTerms,
            notes: values.notes,
            items: quotation.items
        };

        createOrder(payload, {
            onSuccess: () => {
                toast.success(`Sales Order created successfully from ${quotation.quotationNumber}`);
                onClose();
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to create Sales Order");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Convert to Sales Order</DialogTitle>
                    <DialogDescription>
                        Review the operational details before freezing this transaction.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 p-4 rounded-md mb-4 border border-blue-100 flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold">Snapshot Warning</p>
                        <p>This will freeze prices at <strong>{formatCurrency(quotation.total)}</strong>. Global price changes after this moment will not affect this order.</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="deliveryDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Expected Delivery Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Terms</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. COD, 30 Days, PDC" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="deliveryAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Delivery Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Complete site address for the driver..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        This will appear on the Delivery Receipt.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator className="my-4" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Items to convert:</span>
                            <span className="font-medium">{quotation.items.length} Line Items</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total Value:</span>
                            <span className="font-bold text-lg">{formatCurrency(quotation.total)}</span>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm & Create Order
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};