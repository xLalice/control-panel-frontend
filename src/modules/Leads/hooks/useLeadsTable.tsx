import { useState, useEffect, useMemo } from "react";
import {
  SortingState,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { PAGE_SIZE } from "../constants/constants";
import { Lead } from "../types/leads.types";
import { useForm } from "react-hook-form";
import { Filters } from "../types/leads.types";
import { Button, Badge } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { LeadStatus } from "../constants/constants";
import { useLeadsData } from "./useLeadsData";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState("L");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("S");
      } else if (window.innerWidth < 1024) {
        setScreenSize("M");
      } else {
        setScreenSize("L");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

export const useLeadsTable = () => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const screenSize = useScreenSize();

  const { register, control, watch, reset } = useForm<Filters>({
    defaultValues: {
      search: "",
      status: undefined,
      assignedTo: undefined,
    },
  });

  const filters = watch();

 

  const {data: leadsData, isLoading, refetch: refetchLeads} = useLeadsData({
    filters,
    sorting,
    page
  })

  const hasActiveFilters =
    filters.search || filters.status || filters.assignedTo;

  const resetFilters = () => {
    reset({
      search: "",
      status: undefined,
      assignedTo: undefined,
    });
  };

  const columns: ColumnDef<Lead>[] = useMemo(() => {
    const baseColumns: ColumnDef<Lead>[] = [
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
        cell: ({ row }) => (
          <span className="font-medium text-blue-600 hover:underline cursor-pointer">
            {row.original.name}
          </span>
        ),
      },
    ];

    if (screenSize === "S") {
      return baseColumns;
    }

    if (screenSize === "M") {
      return [
        ...baseColumns,
        {
          id: "companyName",
          accessorFn: (row: Lead) => row.company?.name || "-",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="w-full flex justify-between items-center px-2"
              aria-label={`Sort by Company Name ${
                column.getIsSorted() === "asc" ? "descending" : "ascending"
              }`}
            >
              Company
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
                  statusColors[row.original.status] ||
                  "bg-gray-100 text-gray-800"
                }
                aria-label={`Status: ${displayStatus}`}
              >
                {displayStatus}
              </Badge>
            );
          },
        },
      ];
    }

    return [
      ...baseColumns,
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
      },
    ];
  }, [screenSize]);

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
    console.log("Filters or sorting changed, resetting to page 1");
    setPage(1);
  }, [filters.search, filters.status, filters.assignedTo, sorting]);

  const handlePageChange = (newPage: number) => {
    console.log("Page change requested:", newPage);
    setPage(newPage);
  };

  const handleRowClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDetailOpen(true);
    window.history.pushState({}, "", `?leadId=${leadId}`);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    window.history.pushState({}, "", window.location.pathname);
    setSelectedLeadId(null);
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
    setPage: handlePageChange, 
    page,
    refetchLeads,
    setSelectedLeadId,
    setIsDetailOpen
  };
};
