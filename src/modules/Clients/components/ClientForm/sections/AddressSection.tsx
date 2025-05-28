import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ClientFormInput } from "../client.schema";

interface AddressSectionProps {
  control: Control<ClientFormInput>;
  title: string;
  prefix: 'billing' | 'shipping';
  showCopyButton?: boolean;
  onCopyClick?: () => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  control,
  title,
  prefix,
  showCopyButton = false,
  onCopyClick,
}) => {
  const getFieldName = (suffix: string) => `${prefix}Address${suffix}` as keyof ClientFormInput;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        {showCopyButton && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyClick}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy from Billing
          </Button>
        )}
      </div>
      
      <FormField
        control={control}
        name={getFieldName('Street')}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Street Address</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter street address"
                {...field}
                value={typeof field.value === 'string' ? field.value : ""}
                className="h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={getFieldName('City')}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ""}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={getFieldName('Region')}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">State/Region</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter state or region"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ""}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={getFieldName('PostalCode')}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter postal code"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ""}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={getFieldName('Country')}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Country</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter country"
                {...field}
               value={typeof field.value === 'string' ? field.value : ""}
                className="h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};