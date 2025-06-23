import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Activity } from "lucide-react";
import {
  ClientStatus,
  clientStatusEnum,
} from "@/modules/Clients/clients.schema";
import { ClientCreateInput } from "../client.schema";

interface BasicInfoSectionProps {
  control: Control<ClientCreateInput>
  isViewMode?: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isViewMode = false,
}) => {
  const statusOptions: ClientStatus[] = clientStatusEnum.options;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">
          Basic Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Name{" "}
                {!isViewMode && <span className="text-destructive">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    isViewMode ? "No name provided" : "Enter client name"
                  }
                  {...field}
                  className={`h-11 ${
                    isViewMode ? "bg-muted/30 border-muted font-medium" : ""
                  }`}
                  readOnly={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="primaryEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Primary Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={
                    isViewMode ? "No email provided" : "Enter email address"
                  }
                  {...field}
                  value={field.value || ""}
                  className={`h-11 ${
                    isViewMode ? "bg-muted/30 border-muted" : ""
                  }`}
                  readOnly={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Primary Phone
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={
                    isViewMode ? "No phone provided" : "Enter phone number"
                  }
                  {...field}
                  value={field.value || ""}
                  className={`h-11 ${
                    isViewMode ? "bg-muted/30 border-muted" : ""
                  }`}
                  readOnly={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Status
              </FormLabel>
              {isViewMode ? (
                <FormControl>
                  <Input
                    value={field.value || "No status set"}
                    className="h-11 bg-muted/30 border-muted capitalize font-medium"
                    readOnly
                  />
                </FormControl>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="capitalize">{status}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
