import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, MapPin } from "lucide-react";
import { ClientCreateInput } from "../client.schema";

interface AddressSectionProps {
  control: Control<ClientCreateInput>;
  title: string;
  prefix: 'billing' | 'shipping';
  showCopyButton?: boolean;
  onCopyClick?: () => void;
  isViewMode?: boolean;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  control,
  title,
  prefix,
  showCopyButton = false,
  onCopyClick,
  isViewMode = false,
}) => {
  const getFieldName = (suffix: string) => `${prefix}Address${suffix}` as keyof ClientCreateInput;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {showCopyButton && !isViewMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyClick}
            className="flex items-center gap-2 text-xs"
          >
            <Copy className="h-3 w-3" />
            Copy from Billing
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name={getFieldName('Street')}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={isViewMode ? "No street address provided" : "Enter street address"}
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ""}
                  className={`h-11 ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                  readOnly={isViewMode}
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
                <FormLabel className="text-sm font-medium text-foreground">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={isViewMode ? "No city provided" : "Enter city"}
                    {...field}
                    value={typeof field.value === 'string' ? field.value : ""}
                    className={`h-11 ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                    readOnly={isViewMode}
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
                <FormLabel className="text-sm font-medium text-foreground">
                  State/Region
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={isViewMode ? "No region provided" : "Enter state or region"}
                    {...field}
                    value={typeof field.value === 'string' ? field.value : ""}
                    className={`h-11 ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                    readOnly={isViewMode}
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
                <FormLabel className="text-sm font-medium text-foreground">
                  Postal Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={isViewMode ? "No postal code provided" : "Enter postal code"}
                    {...field}
                    value={typeof field.value === 'string' ? field.value : ""}
                    className={`h-11 ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                    readOnly={isViewMode}
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
              <FormLabel className="text-sm font-medium text-foreground">
                Country
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={isViewMode ? "No country provided" : "Enter country"}
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ""}
                  className={`h-11 ${isViewMode ? 'bg-muted/30 border-muted' : ''}`}
                  readOnly={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};