import { TableViewProps } from "../Pricing";
import { Aggregate } from "@/types";
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

const aggregateColumns = [
    { id: "name", header: "Material", accessorKey: "name" },
    { id: "type", header: "Type", accessorKey: "type" },
    { id: "source", header: "Source", accessorKey: "source" },
    {
      id: "pickupPrice",
      header: "Pickup Price",
      accessorKey: "pickupPrice",
      cell: ({ row }: { row: { original: Aggregate } }) => 
        `₱${row.original.pickupPrice.toLocaleString()}/${row.original.unit}`,
    },
    {
      id: "deliveryPrice",
      header: "Delivery Price",
      accessorKey: "deliveryPrice",
      cell: ({ row }: { row: { original: Aggregate } }) => 
        `₱${row.original.deliveryPrice.toLocaleString()}/${row.original.unit}`,
    },
    {
      id: "stock",
      header: "Stock Level",
      accessorKey: "stockLevel",
      cell: ({ row }: { row: { original: Aggregate } }) => 
        row.original.stockLevel ? `${row.original.stockLevel} ${row.original.unit}` : 'N/A',
    }
  ];

const AggregateView: React.FC<TableViewProps<Aggregate>> = ({
  data,
  sorting,
  setSorting,
}) => {
  const table = useReactTable({
    data,
    columns: aggregateColumns,
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

export default AggregateView;
