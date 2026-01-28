import React from "react";
import { Controller, UseFormRegister, Control } from "react-hook-form";
import { X } from "lucide-react";
import VisuallyHidden from "@/modules/Leads/components/visually-hidden";
import {
  Input,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Button,
} from "@/components/ui";
import { SALES_ORDER_STATUS } from "../salesOrder.schema";
import { SalesOrderFilters as FilterType } from "../salesOrder.schema";
import { SkeletonFilters } from "@/components/TableSkeleton";

interface SalesOrderFilterProps {
  isFilterOpen: boolean;
  register: UseFormRegister<FilterType>;
  control: Control<FilterType>;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  isLoading?: boolean;
}

export const SalesOrderFilters: React.FC<SalesOrderFilterProps> = ({
  isFilterOpen,
  register,
  control,
  hasActiveFilters,
  resetFilters,
  isLoading = false,
}) => {
  if (isLoading) return <SkeletonFilters />;

  return (
    <div
      id="filter-panel"
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${
        isFilterOpen ? "block" : "hidden md:grid"
      }`}
    >
      <div className="relative col-span-1 md:col-span-2">
        <VisuallyHidden>
          <label htmlFor="search-orders">Search Orders</label>
        </VisuallyHidden>
        <Input
          id="search-orders"
          placeholder="Search by Order # or Client Name..."
          {...register("search")}
          className="w-full"
          aria-label="Search orders"
        />
      </div>

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            onValueChange={(value) => {
              field.onChange(value === "all" ? undefined : value);
            }}
            value={field.value || "all"}
          >
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(SALES_ORDER_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/([A-Z])/g, " $1").trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {hasActiveFilters && (
        <div className="col-span-1 md:col-span-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
          >
            <X size={16} />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};