import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { LeadStatus } from "../constants/constants";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { Company, LeadFormData, LeadFormProps } from "../types/leads.types";
import { apiClient } from "@/api/api";
import { User } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const LeadForm = ({ lead, onSuccess, onClose }: LeadFormProps) => {
  const isEditMode = !!lead;
  const [open, setOpen] = useState(false);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCompany, setIsNewCompany] = useState(!isEditMode);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await apiClient.get("/leads/companies");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const defaultValues = isEditMode
    ? {
        companyId: lead.company?.id || "",
        companyName: lead.company?.name || "",
        contactPerson: lead.contactPerson || "",
        email: lead.company?.email || lead.email || "",
        phone: lead.company?.phone || lead.phone || "",
        status: lead.status || "New",
        industry: lead.industry || "",
        region: lead.region || "",
        estimatedValue: lead.estimatedValue?.toString() || "",
        leadScore: lead.leadScore || 0,
        source: lead.source || "",
        notes: lead.notes || "",
        assignedToId: lead.assignedTo?.id || "",
      }
    : {
        companyId: "",
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        status: "New",
        industry: "",
        region: "",
        estimatedValue: "",
        leadScore: 0,
        source: "",
        notes: "",
        assignedToId: "",
      };

  const form = useForm<LeadFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset(defaultValues);
      setIsNewCompany(false);
    }
  }, [lead, isEditMode]);

  const createLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const payload = {
        ...data,
        estimatedValue: data.estimatedValue
          ? parseFloat(data.estimatedValue)
          : null,
        leadScore: data.leadScore ? data.leadScore : null,
      };

      if (isEditMode) {
        const response = await apiClient.put(`/leads/${lead.id}`, payload);
        return response.data;
      } else {
        const response = await apiClient.post("/leads", payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      if (isEditMode) {
        onClose?.();
      } else {
        setOpen(false);
      }
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data: LeadFormData) => {
    createLeadMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const selectedCompanyId = form.watch("companyId");
  const selectedCompany = companies.find(
    (c: Company) => c.id === selectedCompanyId
  );
  const displayCompanyName = selectedCompany
    ? selectedCompany.name
    : "Select company";

  const filteredCompanies =
    searchQuery.trim() === ""
      ? companies
      : companies.filter((company: Company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const dialogContent = (
    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
      <DialogHeader className="pb-2">
        <DialogTitle>
          {isEditMode ? "Edit Lead" : "Create New Lead"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          {isEditMode
            ? "Update the details for this lead. Required fields marked with *."
            : "Enter details for the new lead. Fill in all required fields."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="createNewCompany"
              checked={isNewCompany}
              onChange={() => {
                setIsNewCompany(!isNewCompany);
                if (isNewCompany) {
                  form.setValue("companyName", "");
                } else {
                  form.setValue("companyId", "");
                }
              }}
            />
            <label htmlFor="createNewCompany" className="text-sm">
              {isEditMode ? "Change Company" : "Create New Company"}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {isNewCompany ? (
              <FormField
                control={form.control}
                name="companyName"
                rules={{ required: "Company name is required" }}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">
                      Company Name{isEditMode ? "*" : ""}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
                        {...field}
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="companyId"
                rules={{ required: "Company is required" }}
                render={({}) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">
                      Company{isEditMode ? "*" : ""}
                    </FormLabel>
                    <Popover
                      open={companyPopoverOpen}
                      onOpenChange={setCompanyPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={companyPopoverOpen}
                            className="w-full justify-between font-normal h-8 text-sm"
                          >
                            {displayCompanyName}
                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search company..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="h-8"
                          />
                          <CommandList className="max-h-40">
                            <CommandEmpty>No company found</CommandEmpty>
                            <CommandGroup>
                              {filteredCompanies.map((company: Company) => (
                                <CommandItem
                                  key={company.id}
                                  value={company.name}
                                  onSelect={() => {
                                    form.setValue("companyId", company.id);
                                    setCompanyPopoverOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="text-sm py-1"
                                >
                                  {company.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-3 w-3",
                                      selectedCompanyId === company.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="contactPerson"
              rules={{ required: "Contact person is required" }}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">
                    Contact Person{isEditMode ? "*" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">
                    Email{isEditMode ? "*" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">
                    Status{isEditMode ? "*" : ""}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(LeadStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-sm py-1"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              rules={{ required: "Industry is required" }}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">
                    Industry{isEditMode ? "*" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              rules={{ required: "Region is required" }}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">
                    Region{isEditMode ? "*" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedValue"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">Estimated Value (₱)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                        ₱
                      </span>
                      <Input
                        type="number"
                        className="pl-8 h-8 text-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadScore"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">Lead Score (0-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || null)
                      }
                      value={
                        field.value === null || field.value === undefined
                          ? ""
                          : field.value
                      }
                      min="0"
                      max="100"
                      placeholder="Enter score"
                      className="h-8 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">Source</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-xs">Assigned To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user: User) => (
                        <SelectItem
                          key={user.id}
                          value={user.id}
                          className="text-sm py-1"
                        >
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => (isEditMode ? onClose?.() : setOpen(false))}
              disabled={createLeadMutation.isPending}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLeadMutation.isPending}
              className="h-8 text-xs"
            >
              {createLeadMutation.isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  return isEditMode ? (
    <Dialog open={true} onOpenChange={(open) => !open && onClose?.()}>
      {dialogContent}
    </Dialog>
  ) : (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-yellow-500 text-black h-8 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          Create Lead
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default LeadForm;
