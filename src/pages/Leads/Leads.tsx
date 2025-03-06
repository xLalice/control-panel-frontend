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
import { Skeleton } from "@/components/ui/skeleton";
import { LeadStatus } from "./constants/constants";
import { Lead, Filters } from "./types/leads.types";
import { apiClient, fetchUsers } from "@/api/api";
import { User } from "@/types";
import { ArrowUpDown, X, Filter } from "lucide-react";
import LeadForm from "./components/LeadForm";
import LeadDetailPanel from "./components/LeadDetailModal";
import VisuallyHidden from "./components/visually-hidden";

const PAGE_SIZE = 20;

const LeadsTable = () => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { register, control, watch, reset } = useForm<Filters>({
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
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const hasActiveFilters =
    filters.search || filters.status || filters.assignedTo;

  const resetFilters = () => {
    reset({
      search: "",
      status: undefined,
      assignedTo: undefined,
    });
  };

  const columns: ColumnDef<Lead, unknown>[] = [
    {
      id: "companyName",
      accessorFn: (row: Lead) => row.company?.name || "N/A",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Company Name ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
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
          aria-label={`Sort by Contact Person ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Contact Person
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
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
          aria-label={`Sort by Status ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
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
            aria-label={`Status: ${row.original.status}`}
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
          aria-label={`Sort by Assigned To ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Assigned To
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      // Hide on small screens
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      id: "lastContactDate",
      accessorKey: "lastContactDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Last Contact ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Last Contact
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.lastContactDate
          ? format(new Date(row.original.lastContactDate), "MMM d, yyyy")
          : "-",
      // Hide on small screens
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      id: "followUpDate",
      accessorKey: "followUpDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Follow-Up Date ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Follow-Up Date
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.followUpDate
          ? format(new Date(row.original.followUpDate), "MMM d, yyyy")
          : "-",
      // Hide on small screens
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      id: "leadScore",
      accessorKey: "leadScore",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Score ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.leadScore ? row.original.leadScore.toFixed(1) : "-",
      // Hide on small screens
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      id: "industry",
      accessorKey: "industry",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Industry ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Industry
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      // Hide on small screens
      meta: {
        className: "hidden xl:table-cell",
      },
    },
    {
      id: "region",
      accessorKey: "region",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center"
          aria-label={`Sort by Region ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      // Hide on small screens
      meta: {
        className: "hidden xl:table-cell",
      },
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
    window.history.pushState({}, "", `?leadId=${leadId}`);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    window.history.pushState({}, "", window.location.pathname);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDetailOpen) {
        handleDetailClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailOpen]);

  const SkeletonTableRow = () => (
    <TableRow className="animate-pulse">
      {columns.map((column, index) => (
        <TableCell key={index} className={(column.meta as any)?.className}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  const SkeletonFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <div className="relative">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Leads</CardTitle>
            <div className="flex flex-col xs:flex-row gap-2">
              <LeadForm onSuccess={() => {}} />
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-expanded={isFilterOpen}
                aria-controls="filter-panel"
                className="md:hidden flex items-center gap-2"
              >
                <Filter size={16} aria-hidden="true" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {usersLoading ? (
            <SkeletonFilters />
          ) : (
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div
              className={`rounded-md border transition-opacity duration-200 ${
                isDetailOpen ? "md:opacity-100 opacity-50" : "opacity-100"
              }`}
              role="region"
              aria-label="Leads table"
              tabIndex={0}
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={
                            (header.column.columnDef.meta as any)?.className
                          }
                        >
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
                    // Skeleton loading state
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonTableRow key={`skeleton-${index}`} />
                    ))
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(row.original.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleRowClick(row.original.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={row.original.id === selectedLeadId}
                        data-state={
                          row.original.id === selectedLeadId
                            ? "selected"
                            : undefined
                        }
                        style={{
                          backgroundColor:
                            row.original.id === selectedLeadId
                              ? "rgba(0,0,0,0.04)"
                              : undefined,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={
                             ( cell.column.columnDef.meta as any)?.className as string
                            }
                          >
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 text-sm text-muted-foreground">
                  {leadsData?.total || 0} total leads
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  <div
                    className="flex items-center justify-center text-sm font-medium"
                    aria-live="polite"
                  >
                    Page {page} of{" "}
                    {Math.ceil((leadsData?.total || 0) / PAGE_SIZE)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={
                      !leadsData ||
                      page >= Math.ceil(leadsData.total / PAGE_SIZE)
                    }
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <LeadDetailPanel
        leadId={selectedLeadId}
        isOpen={isDetailOpen && !!selectedLeadId}
        onClose={handleDetailClose}
      />
    </div>
  );
};

export default LeadsTable;
