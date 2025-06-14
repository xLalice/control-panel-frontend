import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { convertInquiryToLead } from "@/api/api";
import { Search, Filter, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { InquiryDetails } from "../InquiryDetails/InquiryDetails";
import { Inquiry } from "../../types";
import { CreateQuoteDialog } from "../CreateQuoteDialog";
import { ScheduleInquiryDialog } from "../ScheduleInquiryDialog";
import { InquiryListSkeleton } from "../ui/Skeleton";
import { useInquiriesData } from "./hooks/useInquiriesData";
import { useInquiriesTable } from "./hooks/useInquiriesTable";
import { CustomPagination } from "@/components/CustomPagination";
import { flexRender } from "@tanstack/react-table";

interface InquiryListProps {
  refreshTrigger: number;
}

export function InquiryList({ refreshTrigger }: InquiryListProps) {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null
  );
  const [createQuoteDialogOpen, setCreateQuoteDialogOpen] = useState(false);
  const [scheduleInquiryDialogOpen, setScheduleInquiryDialogOpen] =
    useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] =
    useState<Inquiry | null>(null);

  const {
    inquiries,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    localSearchInput,
    handleSearchInputChange,
    sorting,
    setSorting,
  } = useInquiriesData({
    refreshTrigger,
  });


  const openCreateQuoteDialog = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setCreateQuoteDialogOpen(true);
  };

  const openScheduleInquiryDialog = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setScheduleInquiryDialogOpen(true);
  };

  const openDetailsDialog = (inquiry: Inquiry) => {
    setSelectedInquiryForDetails(inquiry);
    setDetailsDialogOpen(true);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const { table, columns } = useInquiriesTable({
    inquiries,
    currentPage,
    setCurrentPage,
    openDetailsDialog,
    openCreateQuoteDialog,
    openScheduleInquiryDialog,
    sorting,
    setSorting,
  });

  if (isLoading) {
    return <InquiryListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error loading inquiries
      </div>
    );
  }
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Inquiries</CardTitle>
              <CardDescription>
                Manage and track customer inquiries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-8 w-64"
                  value={localSearchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("all")}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("New")}
                  >
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("Quoted")}
                  >
                    Quoted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("Approved")}
                  >
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("Scheduled")}
                  >
                    Scheduled
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("Fulfilled")}
                  >
                    Fulfilled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center justify-center gap-1 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getCanSort() && (
                            <>
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowUpDown
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                    No inquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
            <div className="flex text-sm text-muted-foreground">
              {inquiries?.meta.total ?? 0} inquiries
            </div>

            {(inquiries?.meta.totalPages || 0) > 1 && (
              <CustomPagination
                onPageChange={(page) => {
                  console.log(
                    "InquiryList: onPageChange callback received page:",
                    page
                  );
                  setCurrentPage(page);
                }}
                totalPages={inquiries?.meta.totalPages || 0}
                currentPage={currentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals/Dialogs */}
      {selectedInquiryId && (
        <>
          <CreateQuoteDialog
            open={createQuoteDialogOpen}
            onClose={() => setCreateQuoteDialogOpen(false)}
            inquiryId={selectedInquiryId}
          />

          <ScheduleInquiryDialog
            open={scheduleInquiryDialogOpen}
            onClose={() => setScheduleInquiryDialogOpen(false)}
            inquiryId={selectedInquiryId}
          />
        </>
      )}

      {selectedInquiryForDetails && (
        <InquiryDetails
          inquiry={selectedInquiryForDetails}
          onConvertToLead={() => {
            convertInquiryToLead(selectedInquiryForDetails.id);
            setDetailsDialogOpen(false);
          }}
          onClose={() => setDetailsDialogOpen(false)}
          isOpen={detailsDialogOpen}
        />
      )}
    </>
  );
}
