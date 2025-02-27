import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadStatus } from "./constants/constants";
import { Lead, Filters } from "./types/leads.types";
import { apiClient, fetchUsers } from "@/api/api";
import { User } from "@/types";
import { ArrowUpDown } from "lucide-react";
import LeadForm from "./components/LeadForm";
import LeadDetailPanel from "./components/LeadDetailModal";

const PAGE_SIZE = 20;

const LeadsTable = () => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { register, control, watch } = useForm<Filters>({
    defaultValues: {
      search: "",
      status: undefined,
      assignedTo: undefined,
    },
  });

  const filters = watch();

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["leads", filters, page, sorting],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);

      // Add pagination parameters
      params.set("page", page.toString());
      params.set("pageSize", PAGE_SIZE.toString());

      if (sorting.length > 0) {
        params.set("sortBy", sorting[0].id);
        params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
      }

      const response = await apiClient("/leads?" + params.toString());
      return response.data as { leads: Lead[]; total: number };
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      const response = fetchUsers();
      console.log("Fetched Users:", response);
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const columns: ColumnDef<Lead>[] = [
    {
      id: "companyName",
      accessorFn: (row: Lead) => row.company?.name || "N/A",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "contactPerson",
      accessorKey: "contactPerson",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Contact Person
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const statusColors: Record<string, string> = {
          Converted: "bg-green-100 text-green-800",
          Lost: "bg-red-100 text-red-800",
          New: "bg-blue-100 text-blue-800",
        };

        return (
          <Badge
            className={
              statusColors[row.original.status] || "bg-gray-100 text-gray-800"
            }
          >
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "assignedTo",
      accessorFn: (row: Lead) => row.assignedTo?.name || "Unassigned",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Assigned To
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "lastContactDate",
      accessorKey: "lastContactDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Last Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.lastContactDate
          ? format(new Date(row.original.lastContactDate), "MMM d, yyyy")
          : "-",
    },
    {
      id: "followUpDate",
      accessorKey: "followUpDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Follow-Up Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.followUpDate
          ? format(new Date(row.original.followUpDate), "MMM d, yyyy")
          : "-",
    },
    {
      id: "leadScore",
      accessorKey: "leadScore",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.leadScore ? row.original.leadScore.toFixed(1) : "-",
    },
    {
      id: "industry",
      accessorKey: "industry",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Industry
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "region",
      accessorKey: "region",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    
  ];

  const table = useReactTable({
    data: leadsData?.leads || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: leadsData ? Math.ceil(leadsData.total / PAGE_SIZE) : 0,
    onSortingChange: setSorting,
    manualSorting: true,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [filters, sorting]);

  const handleRowClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDetailOpen(true);
    // If you want to support deep linking, you could update URL with query params here
    // window.history.pushState({}, '', `?leadId=${leadId}`);
  };
  
  // Handler for panel close
  const handleDetailClose = () => {
    setIsDetailOpen(false);
    // Optional: update URL to remove the query param
    // window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="relative">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <LeadForm onSuccess={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search leads..."
              {...register("search")}
              className="w-full"
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="unassigned" value="unassigned">
                      Unassigned
                    </SelectItem>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      users.map((user: User) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`rounded-md border transition-opacity duration-200 ${isDetailOpen ? 'md:opacity-100 opacity-50' : 'opacity-100'}`}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(row.original.id)}
                      data-state={row.original.id === selectedLeadId ? "selected" : undefined}
                      style={{
                        backgroundColor: row.original.id === selectedLeadId ? "rgba(0,0,0,0.04)" : undefined
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {leadsData?.total || 0} total leads
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center justify-center text-sm font-medium">
                Page {page} of {Math.ceil((leadsData?.total || 0) / PAGE_SIZE)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={
                  !leadsData || page >= Math.ceil(leadsData.total / PAGE_SIZE)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replace the old modal with the slide-in panel */}
      <LeadDetailPanel 
        leadId={selectedLeadId}
        isOpen={isDetailOpen && !!selectedLeadId}
        onClose={handleDetailClose}
      />
    </div>
  );
};

export default LeadsTable;
