import { useState, useEffect } from "react";
import {
  SortingState,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "../constants/constants";
import { apiClient } from "@/api/api";
import { Lead } from "../types/leads.types";
import { useForm } from "react-hook-form";
import { Filters } from "../types/leads.types";
import { Button, Badge } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fetchUsers } from "@/api/api";

export const useLeadsTable = () => {
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

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      const response = fetchUsers();
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["leads", filters, page, sorting],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);

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
          New: "bg-blue-100 text-blue-800", 
          Contacted: "bg-indigo-100 text-indigo-800", 
          Qualified: "bg-purple-100 text-purple-800", 
          ProposalSent: "bg-pink-100 text-pink-800", 
          Negotiation: "bg-amber-100 text-amber-800",

          // Outcome Statuses
          Won: "bg-green-100 text-green-800", 
          Lost: "bg-red-100 text-red-800"
        };

        return (
          <Badge
            className={
              statusColors[row.original.status] || "bg-gray-100 text-gray-800"
            }
            aria-label={`Status: ${row.original.status}`}
          >
            {row.original.status.replace(/([A-Z])/g, ' $1').trim()}
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
      meta: {
        className: "hidden lg:table-cell",
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

  return {
    selectedLeadId,
    isFilterOpen,
    setIsFilterOpen,
    register,
    control,
    isLoading,
    hasActiveFilters,
    resetFilters,
    table,
    handleRowClick,
    columns,
    handleDetailClose,
    isDetailOpen,
    leadsData,
    setPage,
    page,
    users,
    usersLoading,
  };
};
