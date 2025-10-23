import { SkeletonTableRow } from "./components/skeletons/LeadTableSkeletons";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
} from "@/components/ui";
import { PAGE_SIZE } from "./constants/constants";
import { Filter } from "lucide-react";
import LeadForm from "./components/LeadForm/LeadForm";
import LeadDetailPanel from "./components/LeadDetail/LeadDetailPanel";
import { useLeadsTable } from "./hooks/useLeadsTable";
import { LeadFilters } from "./components/LeadFilters";
import { useEffect, useState } from "react";
import { CustomPagination } from "@/components/CustomPagination";
import { useLocation } from "react-router-dom";

const LeadsTable = () => {
  const {
    columns,
    setIsFilterOpen,
    isFilterOpen,
    register,
    control,
    hasActiveFilters,
    resetFilters,
    isDetailOpen,
    table,
    isLoading,
    handleRowClick,
    handleDetailClose,
    selectedLeadId,
    leadsData: allLeads,
    setPage,
    page: currentPage,
    setSelectedLeadId,
    setIsDetailOpen,
  } = useLeadsTable();

  const location = useLocation();

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCreateFormClose = () => {
    setIsCreateFormOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsCreateFormOpen(open);
  };

  useEffect(() => {
    if (location.state && (location.state as any).leadIdToOpen) {
      const idFromState = (location.state as any).leadIdToOpen;
      setSelectedLeadId(idFromState);
      setIsDetailOpen(true);

      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const totalItems = allLeads?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className=" mx-auto p-6">
      <Card className="w-full border-[0]">
        <CardHeader className="border-[0]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-3xl font-bold tracking-tight mb-5">
              Leads
            </CardTitle>
            <div className="flex flex-col xs:flex-row gap-2">
              <LeadForm
                isOpen={isCreateFormOpen}
                onClose={handleCreateFormClose}
                onOpenChange={handleOpenChange}
              />
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
          <LeadFilters
            register={register}
            control={control}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
            isFilterOpen={isFilterOpen}
          />
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
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonTableRow
                        key={`skeleton-${index}`}
                        columns={columns}
                      />
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
                              (cell.column.columnDef.meta as any)
                                ?.className as string
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
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
                <div className="flex text-sm text-muted-foreground">
                  {totalItems} leads
                </div>

                {totalPages > 1 && (
                  <CustomPagination
                    onPageChange={(page) => {
                      handlePageChange(page);
                    }}
                    totalPages={totalPages}
                    currentPage={currentPage}
                  />
                )}
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
