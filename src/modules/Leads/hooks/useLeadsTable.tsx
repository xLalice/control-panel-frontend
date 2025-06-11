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
import { LeadStatus } from "../constants/constants";

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

  const {
    data: leadsData,
    isLoading,
    refetch: refetchLeads,
  } = useQuery({
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

  const columns: ColumnDef<Lead>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Lead Name ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Lead Name
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium text-blue-600 hover:underline cursor-pointer">
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "companyName",
      accessorFn: (row: Lead) => row.company?.name || "-",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Company Name ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      meta: {
        className: "hidden sm:table-cell",
      },
    },
    {
      id: "contactPerson",
      accessorKey: "contactPerson",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Contact Person ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Contact Person
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Email ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.email ? (
          <a
            href={`mailto:${row.original.email}`}
            className="text-blue-500 hover:underline"
          >
            {row.original.email}
          </a>
        ) : (
          "-"
        ),
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) =>
        row.original.phone ? (
          <a
            href={`tel:${row.original.phone}`}
            className="text-blue-500 hover:underline"
          >
            {row.original.phone}
          </a>
        ) : (
          "-"
        ),
      meta: {
        className: "hidden xl:table-cell",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
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
          [LeadStatus.New]: "bg-blue-100 text-blue-800",
          [LeadStatus.Contacted]: "bg-indigo-100 text-indigo-800",
          [LeadStatus.Qualified]: "bg-purple-100 text-purple-800",
          [LeadStatus.ProposalSent]: "bg-pink-100 text-pink-800",
          [LeadStatus.Negotiation]: "bg-amber-100 text-amber-800",
          [LeadStatus.Won]: "bg-green-100 text-green-800",
          [LeadStatus.Lost]: "bg-red-100 text-red-800",
        };

        const displayStatus = row.original.status
          .replace(/([A-Z])/g, " $1")
          .trim();

        return (
          <Badge
            className={
              statusColors[row.original.status] || "bg-gray-100 text-gray-800"
            }
            aria-label={`Status: ${displayStatus}`}
          >
            {displayStatus}
          </Badge>
        );
      },
      // Always visible, important column
    },
    {
      id: "assignedTo",
      accessorFn: (row: Lead) => row.assignedTo?.name || "Unassigned",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Assigned To ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Assigned To
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      meta: {
        className: "hidden lg:table-cell", // Hide on large screens
      },
    },
    {
      id: "estimatedValue",
      accessorKey: "estimatedValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Value ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Est. Value
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) => {
        if (
          row.original.estimatedValue !== null &&
          row.original.estimatedValue !== undefined
        ) {
          return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.original.estimatedValue);
        }
        return "-";
      },
      meta: {
        className: "hidden xl:table-cell",
      },
    },
    {
      id: "lastContactDate",
      accessorKey: "lastContactDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
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
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      id: "followUpDate",
      accessorKey: "followUpDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center px-2"
          aria-label={`Sort by Follow-Up Date ${
            column.getIsSorted() === "asc" ? "descending" : "ascending"
          }`}
        >
          Follow-Up
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.followUpDate
          ? format(new Date(row.original.followUpDate), "MMM d, yyyy")
          : "-",
      meta: {
        className: "hidden xl:table-cell",
      },
    },
    {
      id: "source",
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => row.original.source || "-",
      meta: {
        className: "hidden 2xl:table-cell",
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
    refetchLeads,
  };
};
