import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="OnHold">On Hold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
