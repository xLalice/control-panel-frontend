import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@radix-ui/react-select";
import { ClientStatus } from "@/modules/Clients/clients.schema";

export const TableFilters = ({
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
}: {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: ClientStatus) => void;
}) => {
  return (
    <div className="flex items-center justify-between space-x-4 py-4 px-6">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8 max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="OnHold">On Hold</option>
          </Select>
        </div>
      </div>
      
    </div>
  );
};