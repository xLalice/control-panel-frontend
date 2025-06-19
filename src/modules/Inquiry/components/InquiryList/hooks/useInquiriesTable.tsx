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
} from "@/components/ui";
import { format } from "date-fns";
import {
  useCloseInquiry,
  useConvertToLead,
  useReviewInquiry,
} from "./useInquiriesMutations";
import { InquiryStatusBadge } from "../../InquiryStatusBadge";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface UseInquiriesTableProps {
  inquiries: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  openDetailsDialog: (inquiry: Inquiry) => void;
  openCreateQuoteDialog: (inquiryId: string) => void;
  openScheduleInquiryDialog: (inquiryId: string) => void;
  openAssociateInquiryDialog: (inquiryId: string) => void;
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
  openAssociateInquiryDialog,
  sorting,
  setSorting,
}: UseInquiriesTableProps) => {
  const markReviewedMutation = useReviewInquiry();
  const closeInquiryMutation = useCloseInquiry();
  const convertToLeadMutation = useConvertToLead();

  const navigate = useNavigate();

  const openAssociate = (id: string, type: "client" | "lead") => {
    if (type === "client") {
      navigate(`/clients/`, { state: { clientIdToOpen: id } });
    } else {
      navigate(`/leads`, { state: { leadIdToOpen: id } });
    }
  };

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
        enableSorting: false,
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
        cell: ({ row }) => {
          const items = row.original.items;

          const productNames = items
            .map((item) => item.product.name)
            .filter((name) => name)
            .join(", ");

          return productNames || "N/A";
        },
      },
      {
        id: "status",
        accessorKey: "status",
        enableSorting: true,
        header: () => (
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-2"
          >
            Status
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <InquiryStatusBadge status={row.original.status as InquiryStatus} />
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
          const isArchivedState = [
            InquiryStatus.Closed,
            InquiryStatus.ConvertedToLead,
            InquiryStatus.AssociatedToClient,
          ].includes(inquiry.status as InquiryStatus);

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openDetailsDialog(inquiry)}>
                  View Details
                </DropdownMenuItem>

                {inquiry.status === InquiryStatus.New && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => markReviewedMutation.mutate(inquiry.id)}
                    >
                      Mark as Reviewed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => closeInquiryMutation.mutate(inquiry.id)}
                      className="text-red-600 focus:bg-red-50"
                    >
                      Close (Mark as Junk/Spam)
                    </DropdownMenuItem>
                  </>
                )}

                {inquiry.status === InquiryStatus.Reviewed && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => convertToLeadMutation.mutate(inquiry.id)}
                    >
                      Promote to Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openAssociateInquiryDialog(inquiry.id)}
                    >
                      Associate with Existing Client
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openAssociateInquiryDialog(inquiry.id)}
                    >
                      Associate with Existing Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openCreateQuoteDialog(inquiry.id)}
                    >
                      Generate Quotation Directly
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => closeInquiryMutation.mutate(inquiry.id)}
                      className="text-red-600 focus:bg-red-50"
                    >
                      Close (No Potential)
                    </DropdownMenuItem>
                  </>
                )}

                {inquiry.status === InquiryStatus.QuotationGenerated && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        openScheduleInquiryDialog(inquiry.id)
                      }
                    >
                      Mark Quote Accepted & Schedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        closeInquiryMutation.mutate(inquiry.id)
                      }
                      className="text-red-600 focus:bg-red-50"
                    >
                      Close (Quote Rejected)
                    </DropdownMenuItem>
                  </>
                )}

                {inquiry.status === InquiryStatus.DeliveryScheduled && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => closeInquiryMutation.mutate(inquiry.id)}
                    >
                      Mark as Fulfilled & Close
                    </DropdownMenuItem>
                  </>
                )}

                {isArchivedState && (
                  <>
                    <DropdownMenuSeparator />
                   {inquiry.status === InquiryStatus.ConvertedToLead && inquiry.leadOriginated && (
                      <DropdownMenuItem
                        onClick={() => {
                          const leadId = inquiry.leadOriginated!.id; 
                          if (leadId) { 
                            openAssociate(leadId, "lead");
                          }
                        }}
                      >
                        View Associated Lead
                      </DropdownMenuItem>
                    )}

                    {inquiry.status === InquiryStatus.AssociatedToClient && inquiry.clientId && (
                      <DropdownMenuItem
                        onClick={() => {
                          const clientId = inquiry.clientId; 
                          if (clientId) { 
                            openAssociate(clientId, "client");
                          }
                        }}
                      >
                        View Associated Client
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      disabled
                      className="text-xs text-muted-foreground"
                    >
                      Inquiry is Closed
                    </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:bg-red-50">
                    Delete Inquiry
                  </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ];
    return baseColumns;
  }, [openDetailsDialog, openCreateQuoteDialog, openScheduleInquiryDialog]);

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
