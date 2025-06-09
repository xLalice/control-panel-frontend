import { TableRow, TableCell, Skeleton } from "@/components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "../../types/leads.types";

export const SkeletonTableRow = ({
  columns,
}: {
  columns: ColumnDef<Lead, unknown>[];
}) => (
  <TableRow className="animate-pulse">
    {columns.map((column, index) => (
      <TableCell key={index} className={(column.meta as any)?.className}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

export const SkeletonFilters = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);
