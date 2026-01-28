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
} from "@/components/ui";
import { Filter, Truck } from "lucide-react";
import { useSalesOrderTable } from "./hooks/useSalesOrderTable";
import { SalesOrderFilters } from "./components/SalesOrderFilters";
import { CustomPagination } from "@/components/CustomPagination";
import { SkeletonTableRow } from "../../components/TableSkeleton";
import { SlideInPanel } from "@/components/SlideInPanel/SlideInPanel";
import { SalesOrderDetail } from "./components/SalesOrderDetail";

const SalesOrdersTable = () => {
  const {
    table,
    columns,
    isLoading,
    data,
    page,
    setPage,
    isFilterOpen,
    setIsFilterOpen,
    register,
    control,
    hasActiveFilters,
    resetFilters,
    selectedOrderId,
    handleRowClick,
    handleDetailClose,
  } = useSalesOrderTable();

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / 10);
  return (
    <div className="mx-auto p-6">
      <Card className="w-full border-0 shadow-sm">
        <CardHeader className="border-0 pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <Truck className="h-8 w-8 text-emerald-600" />
                <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                    Sales Orders
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Manage fulfillment and delivery</p>
                </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                {isFilterOpen ? "Hide Filters" : "Filters"}
              </Button>
            </div>
          </div>

          <SalesOrderFilters
            register={register}
            control={control}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
            isFilterOpen={isFilterOpen}
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-50/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTableRow key={i} columns={columns} />
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(row.original.id)}
                      data-state={row.original.id === selectedOrderId ? "selected" : undefined}
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
                      className="h-24 text-center text-muted-foreground"
                    >
                      No active orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                {totalItems > 0 ? (
                    <span>Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalItems)} of {totalItems} orders</span>
                ) : "No orders"}
            </div>
            
            {totalPages > 1 && (
                <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                />
            )}
          </div>
        </CardContent>
      </Card>

      <SlideInPanel
        isOpen={!!selectedOrderId}
        onClose={handleDetailClose}
        title="Order Details"
       
      >
         
         {selectedOrderId && <SalesOrderDetail orderId={selectedOrderId} />}
      </SlideInPanel>
    </div>
  );
};

export default SalesOrdersTable;