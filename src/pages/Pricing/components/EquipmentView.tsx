import { TableViewProps } from "../Pricing";
import { Equipment } from "@/types";
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

const equipmentColumns = [
  { id: "name", header: "Equipment Name", accessorKey: "name" },
  { id: "type", header: "Type", accessorKey: "type" },
  { id: "model", header: "Model", accessorKey: "model" },
  { id: "manufacturer", header: "Manufacturer", accessorKey: "manufacturer" },
  {
    id: "hourlyRate",
    header: "Hourly Rate",
    accessorKey: "hourlyRate",
    cell: ({ row }: { row: { original: Equipment } }) =>
      `₱${row.original.hourlyRate.toLocaleString()}/hr`,
  },
  {
    id: "dailyRate",
    header: "Daily Rate",
    accessorKey: "dailyRate",
    cell: ({ row }: { row: { original: Equipment } }) =>
      `₱${row.original.dailyRate.toLocaleString()}/day`,
  },

  { id: "status", header: "Status", accessorKey: "status" },
];

const EquipmentView: React.FC<TableViewProps<Equipment>> = ({
  data,
  sorting,
  setSorting,
}) => {
  const table = useReactTable({
    data,
    columns: equipmentColumns,
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

export default EquipmentView;
