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
import {
  Company,
  LeadFormData,
  LeadFormProps,
} from "../types/leads.types";
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

  // Optimized queries with select to transform data
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await apiClient.get("/leads/companies");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const defaultValues = isEditMode
    ? {
        companyId: lead.company?.id || "",
        companyName: lead.company?.name || "",
        contactPerson: lead.contactPerson || "",
        email: lead.company?.email || "",
        phone: lead.company?.phone || "",
        status: lead.status || "New",
        industry: lead.industry || "",
        region: lead.region || "",
        estimatedValue: lead.estimatedValue?.toString() || "",
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
        source: "",
        notes: "",
        assignedToId: "",
      };

  const form = useForm<LeadFormData>({
    defaultValues,
  });

  // Reset form when switching between create and edit modes
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

  // Get selected company name for display
  const selectedCompanyId = form.watch("companyId");
  const selectedCompany = companies.find(
    (c: Company) => c.id === selectedCompanyId
  );
  const displayCompanyName = selectedCompany
    ? selectedCompany.name
    : "Select company";

  // Filter companies based on search query
  const filteredCompanies =
    searchQuery.trim() === ""
      ? companies
      : companies.filter((company: Company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const dialogContent = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? "Edit Lead" : "Create New Lead"}
        </DialogTitle>
        <DialogDescription>
          {isEditMode
            ? "Update the details for this lead. Required fields are marked with an asterisk."
            : "Enter the details for the new lead. Fill in all required fields."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="createNewCompany"
                checked={isNewCompany}
                onChange={() => {
                  setIsNewCompany(!isNewCompany);
                  // Clear opposite field when switching modes
                  if (isNewCompany) {
                    form.setValue("companyName", "");
                  } else {
                    form.setValue("companyId", "");
                  }
                }}
              />
              <label htmlFor="createNewCompany">
                {isEditMode ? "Change Company" : "Create New Company"}
              </label>
            </div>

            {isNewCompany ? (
              <FormField
                control={form.control}
                name="companyName"
                rules={{ required: "Company name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name{isEditMode ? "*" : ""}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="companyId"
                rules={{ required: "Company is required" }}
                render={({}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Company{isEditMode ? "*" : ""}</FormLabel>
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
                            className="w-full justify-between font-normal"
                          >
                            {displayCompanyName}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search company..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>No company found</CommandEmpty>
                            <CommandGroup>
                              {filteredCompanies.map((company: Company) => (
                                <CommandItem
                                  key={company.id}
                                  value={company.name}
                                  onSelect={() => {
                                    form.setValue("companyId", company.id);
                                    setCompanyPopoverOpen(false);
                                    setSearchQuery(""); // Clear search after selection
                                  }}
                                >
                                  {company.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="contactPerson"
              rules={{ required: "Contact person is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person{isEditMode ? "*" : ""}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
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
                <FormItem>
                  <FormLabel>Email{isEditMode ? "*" : ""}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status{isEditMode ? "*" : ""}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(LeadStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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
              name="industry"
              rules={{ required: "Industry is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry{isEditMode ? "*" : ""}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              rules={{ required: "Region is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region{isEditMode ? "*" : ""}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user: User) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => (isEditMode ? onClose?.() : setOpen(false))}
              disabled={createLeadMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLeadMutation.isPending}>
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
        <Button className="ml-auto bg-yellow-500 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create Lead
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default LeadForm;
