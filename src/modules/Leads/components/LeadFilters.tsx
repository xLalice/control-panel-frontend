import VisuallyHidden from "./visually-hidden";
import {
  Input,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Button,
} from "@/components/ui";
import { LeadStatus } from "../constants/constants";
import { User } from "@/types/sharedTypes";
import { Controller, UseFormRegister, Control } from "react-hook-form";
import { X } from "lucide-react";
import { Filters } from "../types/leads.types";
import React from "react";
import { useUsersData } from "@/modules/UserManagement/hooks/useUsersData";
import { SkeletonFilters } from "./skeletons/LeadTableSkeletons";

interface LeadFilterProps {
  isFilterOpen: boolean;
  register: UseFormRegister<Filters>;
  control: Control<Filters, any, Filters>;
  hasActiveFilters: string | undefined;
  resetFilters: () => void;
}

export const LeadFilters: React.FC<LeadFilterProps> = ({
  isFilterOpen,
  register,
  control,
  hasActiveFilters,
  resetFilters,
}) => {
  const { data: users = [], isLoading } = useUsersData();
  return (
    !isLoading ? ( 
    <div
      id="filter-panel"
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
        isFilterOpen ? "block" : "hidden md:grid"
      }`}
    >
      <div className="relative">
        <VisuallyHidden>
          <label htmlFor="search-leads">Search leads</label>
        </VisuallyHidden>
        <Input
          id="search-leads"
          placeholder="Search leads..."
          {...register("search")}
          className="w-full"
          aria-label="Search leads"
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
          >
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-statuses" value="all">
                All Statuses
              </SelectItem>
              {Object.values(LeadStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="assignedTo"
        render={({ field }) => (
          <Select
            onValueChange={(value) => {
              field.onChange(value === "all" ? undefined : value);
            }}
            value={field.value}
          >
            <SelectTrigger aria-label="Filter by assigned user">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-users" value="all">
                All Users
              </SelectItem>
              <SelectItem key="unassigned" value="unassigned">
                Unassigned
              </SelectItem>
              {users.map((user: User) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
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
            className="flex items-center gap-1"
            aria-label="Clear all filters"
          >
            <X size={16} aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
    ) : <SkeletonFilters />
  );
};
