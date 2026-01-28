import { TableRow, TableCell, Skeleton } from "@/components/ui";
import { ColumnDef } from "@tanstack/react-table";

type SkeletonTableRowProps<TData> = {
  columns: ColumnDef<TData>[];
};

export function SkeletonTableRow<TData>({
  columns,
}: SkeletonTableRowProps<TData>) {
  return (
    <TableRow className="animate-pulse">
      {columns.map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}


export const SkeletonFilters = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);