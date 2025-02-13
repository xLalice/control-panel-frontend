import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import PriceHistoryButton from "./PriceHistoryButton";
import { Steel } from "@/types";
import { TableViewProps } from "../Pricing";

const steelColumns = [
  { id: "size", header: "Size", accessorKey: "size" },
  { id: "grade", header: "Grade", accessorKey: "grade" },
  { id: "length", header: "Length", accessorKey: "length" },
  {
    id: "price",
    header: "Price",
    accessorKey: "price",
    cell: ({ row }: { row: { original: Steel } }) =>
      `₱${row.original.price.toLocaleString()} / ${row.original.unit}`,
  },
  {
    id: "stockLevel",
    header: "Stock Level",
    accessorKey: "stockLevel",
    cell: ({ row }: { row: { original: Steel } }) =>
      row.original.stockLevel ?? "N/A",
  },
];

const SteelView: React.FC<TableViewProps<Steel>> = ({
  data,
  sorting,
  setSorting,
}) => {
  const table = useReactTable({
    data,
    columns: steelColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={() => header.column.toggleSorting()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <PriceHistoryButton item={row.original} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SteelView;
