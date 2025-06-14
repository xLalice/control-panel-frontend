import { useMemo } from "react";
import { MoreHorizontal, Building } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Inquiry, InquiryStatus } from "@/modules/Inquiry/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from "@/components/ui";
import { format } from "date-fns";
import { useApproveInquiry, useConvertToLead, useFulfillInquiry } from "./useInquiriesMutations";

interface UseInquiriesTableProps {
  inquiries: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  openDetailsDialog: (inquiry: Inquiry) => void;
  openCreateQuoteDialog: (inquiryId: string) => void;
  openScheduleInquiryDialog: (inquiryId: string) => void;
  sorting: SortingState;
  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
}

export const useInquiriesTable = ({
  inquiries,
  currentPage,
  setCurrentPage,
  openDetailsDialog,
  openCreateQuoteDialog,
  openScheduleInquiryDialog,
  sorting,
  setSorting,
}: UseInquiriesTableProps) => {
  const approveInquiryMutation = useApproveInquiry();
  const fulfillInquiryMutation = useFulfillInquiry();
  const convertToLeadMutation = useConvertToLead();

  const columns: ColumnDef<Inquiry>[] = useMemo(() => {
    const baseColumns: ColumnDef<Inquiry>[] = [
      {
        id: "clientName",
        accessorKey: "clientName",
        enableSorting: true,
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-2"
            aria-label={`Sort by Client Name ${
              column.getIsSorted() === "asc" ? "descending" : "ascending"
            }`}
          >
            Client
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            {row.original.clientName && (
              <div className="flex items-center text-sm">
                <span className="hover:text-primary transition-colors">
                  {row.original.clientName}
                </span>
              </div>
            )}
            {row.original.companyName && (
              <div className="flex items-center text-sm">
                <Building className="mr-2 h-3 w-3 text-muted-foreground" />
                <span className="hover:text-primary transition-colors">
                  {row.original.companyName}
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        id: "product.name",
        accessorKey: "product.name",
        enableSorting: true,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between items-center px-2"
            aria-label={`Sort by Product ${
              column.getIsSorted() === "asc" ? "descending" : "ascending"
            }`}
          >
            Product
          </Button>
        ),
        cell: ({ row }) => row.original.product?.name,
      },
      {
        id: "status",
        accessorKey: "status",
        enableSorting: true,
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
          </Button>
        ),
        cell: ({ row }) => {
          const statusColors: Record<string, string> = {
            [InquiryStatus.New]: "bg-blue-100 text-blue-800",
            [InquiryStatus.Quoted]: "bg-yellow-100 text-yellow-800",
            [InquiryStatus.Approved]: "bg-green-100 text-green-800",
            [InquiryStatus.Scheduled]: "bg-purple-100 text-purple-800",
            [InquiryStatus.Fulfilled]: "bg-teal-100 text-teal-800",
            [InquiryStatus.Cancelled]: "bg-red-100 text-red-800",
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
        id: "createdAt",
        accessorKey: "createdAt",
        enableSorting: true,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between items-center px-2"
            aria-label={`Sort by Created Date ${
              column.getIsSorted() === "asc" ? "descending" : "ascending"
            }`}
          >
            Created At
          </Button>
        ),
        cell: ({ row }) =>
          row.original.createdAt
            ? format(new Date(row.original.createdAt), "MMM d, yyyy")
            : "-",
      },
      {
        id: "assignedTo.name", 

        accessorFn: (row: Inquiry) => row.assignedTo?.name || "Unassigned",
        enableSorting: true,
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
          </Button>
        ),
        cell: ({ row }) => row.original.assignedTo?.name || "Unassigned",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const inquiry = row.original;
          return (
            inquiry.status !== "Cancelled" ? (<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {inquiry.status === "New" && (
                  <DropdownMenuItem
                    onClick={() => openCreateQuoteDialog(inquiry.id)}
                  >
                    Create Quote
                  </DropdownMenuItem>
                )}
                {inquiry.status === "Quoted" && (
                  <DropdownMenuItem
                    onClick={() => approveInquiryMutation.mutate(inquiry.id)}
                  >
                    Approve Inquiry
                  </DropdownMenuItem>
                )}
                {inquiry.status === "Approved" && (
                  <DropdownMenuItem
                    onClick={() => openScheduleInquiryDialog(inquiry.id)}
                  >
                    Schedule Inquiry
                  </DropdownMenuItem>
                )}
                {inquiry.status === "Scheduled" && (
                  <DropdownMenuItem
                    onClick={() => fulfillInquiryMutation.mutate(inquiry.id)}
                  >
                    Fulfill Inquiry
                  </DropdownMenuItem>
                )}
                {(inquiry.status === "Fulfilled" ||
                  inquiry.status === "Scheduled") && (
                  <DropdownMenuItem
                    onClick={() => convertToLeadMutation.mutate(inquiry.id)}
                  >
                    Convert to Lead
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>) :
            <></>
          );
        },
      },
    ];
    return baseColumns;
  }, [
    approveInquiryMutation,
    fulfillInquiryMutation,
    openDetailsDialog,
    openCreateQuoteDialog,
    openScheduleInquiryDialog
  ]);

  const table = useReactTable({
    data: inquiries?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: inquiries?.meta.totalPages ?? 0,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: 20,
      },
      sorting: sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onPaginationChange: (updater) => {
      console.log("useInquiriesTable: onPaginationChange called.");
      if (typeof updater === "function") {
        const newPaginationState = updater(table.getState().pagination);
        console.log(
          "useInquiriesTable: new internal pageIndex:",
          newPaginationState.pageIndex
        );
        setCurrentPage(newPaginationState.pageIndex + 1);
      } else {
        console.log(
          "useInquiriesTable: new internal pageIndex:",
          updater.pageIndex
        );
        setCurrentPage(updater.pageIndex + 1);
      }
    },
    manualPagination: true,
    manualSorting: true,
  });

  return {
    table,
    columns,
  };
};
