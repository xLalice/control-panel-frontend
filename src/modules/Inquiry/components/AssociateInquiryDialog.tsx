import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  UserPlus,
  CheckCircle2,
  Users,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeadsData } from "@/modules/Leads/hooks/useLeadsData";
import { useDebounce } from "@/hooks/useDebounce";
import { useAssociateInquiry } from "./InquiryList/hooks/useAssociateInquiry";
import { useClientData } from "@/modules/Clients/components/ClientList/hooks/useClientData";

const formSchema = z.object({
  entityId: z.string().min(1, "Please select a lead or client to associate."),
  entityType: z.enum(["lead", "client"]),
});

type FormData = z.infer<typeof formSchema>;

interface AssociateEntityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryId: string;
  onSuccess?: () => void;
  defaultTab?: "lead" | "client";
}

export const AssociateEntityDialog: React.FC<AssociateEntityDialogProps> = ({
  isOpen,
  onClose,
  inquiryId,
  onSuccess,
  defaultTab = "lead",
}) => {
  const [activeTab, setActiveTab] = useState<"lead" | "client">(defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: clients, isLoading: isLoadingClients } = useClientData(debouncedSearchTerm);
  const { data, isLoading: isLoadingLeads } = useLeadsData({
    filters: {
      search: debouncedSearchTerm,
    },
    page: 1,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityId: "",
      entityType: defaultTab,
    },
  });

  const associateInquiryMutation = useAssociateInquiry();

  const handleTabChange = (value: string) => {
    const tabValue = value as "lead" | "client";
    setActiveTab(tabValue);
    form.setValue("entityType", tabValue);
    form.setValue("entityId", "");
    setSearchTerm("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      await associateInquiryMutation.mutateAsync({
        id: inquiryId,
        entityId: data.entityId,
        type: data.entityType,
      });

      form.reset();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Failed to associate ${data.entityType}:`, error);
      toast.error(`Failed to associate ${data.entityType}. Please try again.`);
    }
  };

  const isLoading = activeTab === "client" ? isLoadingClients : isLoadingLeads;
  const isSubmitting = associateInquiryMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-6 bg-white shadow-xl rounded-lg">
        <DialogHeader className="flex items-center gap-3 border-b pb-4 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-grow">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Associate with Lead or Client
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Link this inquiry (ID: {inquiryId.substring(0, 8)}...) to an
              existing lead or client.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lead" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leads
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Clients
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lead" className="mt-4">
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Select Existing Lead*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Search and select a lead" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search leads..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="mb-2 h-9"
                            />
                            <Separator className="my-2" />
                          </div>
                          {isLoadingLeads ? (
                            <div className="flex justify-center items-center py-4 text-gray-500">
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />{" "}
                              Loading leads...
                            </div>
                          ) : data?.leads && data.leads.length > 0 ? (
                            data.leads.map((lead) => (
                              <SelectItem key={lead.id} value={lead.id}>
                                {lead.name} ({lead.email || lead.phone || "N/A"}
                                )
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No leads found.
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="client" className="mt-4">
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Select Existing Client*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Search and select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search clients..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="mb-2 h-9"
                            />
                            <Separator className="my-2" />
                          </div>
                          {isLoadingClients ? (
                            <div className="flex justify-center items-center py-4 text-gray-500">
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />{" "}
                              Loading clients...
                            </div>
                          ) : clients && clients.length > 0 ? (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.clientName} (
                                {client.primaryEmail || client.primaryPhone || "N/A"})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No clients found.
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto h-11 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Associate {activeTab === "client" ? "Client" : "Lead"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
