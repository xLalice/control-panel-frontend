import {
  SkeletonTableRow,
  SkeletonFilters,
} from "./components/skeletons/LeadTableSkeletons";
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
import LeadForm from "./components/LeadForm";
import LeadDetailPanel from "./components/LeadDetailModal";
import { useLeadsTable } from "./hooks/useLeadsTable";
import { LeadFilters } from "./components/LeadFilters";

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
    leadsData,
    setPage,
    page,
    usersLoading,
    users,
  } = useLeadsTable();

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
            <LeadFilters
              users={users}
              register={register}
              control={control}
              hasActiveFilters={hasActiveFilters}
              resetFilters={resetFilters}
              isFilterOpen={isFilterOpen}
            />
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
