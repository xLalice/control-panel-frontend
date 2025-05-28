import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientFormInput } from "../client.schema";
import { ClientStatus, clientStatusEnum } from "@/modules/Clients/clients.schema";

interface BasicInfoSectionProps {
  control: Control<ClientFormInput>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => {
  const statusOptions: ClientStatus[] = clientStatusEnum.options;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Client Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} className="h-10" />
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
              <FormLabel className="text-sm font-medium">Primary Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                  value={field.value || ""}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        

        <FormField
          control={control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Primary Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  {...field}
                  value={field.value || ""}
                  className="h-10"
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
              <FormLabel className="text-sm font-medium">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
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
      </div>

      
    </div>
  );
};