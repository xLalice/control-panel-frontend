import { useMemo, useState } from "react";
import {
  SortingState,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Badge } from "@/components/ui";
import { SortableHeader } from "@/components/SortableHeader";
import { formatCurrency } from "@/utils/currency";
import { SalesOrder, SalesOrderFilters } from "../salesOrder.schema";
import { PAGE_SIZE } from "@/constants";
import { useScreenSize } from "@/hooks/useScreenSize";
import { getStatusColor } from "../salesOrder.utils";
import { useSalesOrdersQuery } from "./useSalesOrderQueries";


export const useSalesOrderTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrderId = searchParams.get("orderId");

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const screenSize = useScreenSize();

  const { register, control, watch, reset } = useForm<SalesOrderFilters>({
    defaultValues: { search: "", status: undefined },
  });

  const filters = watch();

  const { data, isLoading } = useSalesOrdersQuery();

  const resetFilters = () => reset({ search: "", status: undefined });
  const hasActiveFilters = !!(filters.search || filters.status);

  const columns: ColumnDef<SalesOrder>[] = useMemo(() => {
    const baseColumns: ColumnDef<SalesOrder>[] = [
      {
        id: "id",
        accessorFn: (row) => row.id.substring(0, 8).toUpperCase(),
        header: ({ column }) => <SortableHeader column={column} title="Order #" />,
        cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span>,
      },
      {
        id: "client",
        accessorFn: (row) => row.client?.clientName || "Unknown",
        header: ({ column }) => <SortableHeader column={column} title="Client" />,
        cell: ({ row }) => <span className="font-medium text-blue-600 truncate max-w-[150px] block">{row.original.client?.clientName}</span>,
      },
      {
        id: "total",
        accessorFn: (row) => {
          if (!row.items) return 0;
          return row.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
        },
        header: ({ column }) => <SortableHeader column={column} title="Total" />,
        cell: ({ getValue }) => (
          <div className="text-right font-medium">
            {formatCurrency(getValue() as number)}
          </div>
        ),
      }
    ];

    if (screenSize === "S") return baseColumns;

    return [
      ...baseColumns,
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge className={getStatusColor(row.original.status)}>
            {row.original.status.replace(/([A-Z])/g, " $1").trim()}
          </Badge>
        ),
      },
      {
        id: "deliveryDate",
        accessorKey: "deliveryDate",
        header: ({ column }) => <SortableHeader column={column} title="Delivery Due" />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {row.original.deliveryDate ? format(new Date(row.original.deliveryDate), "MMM d, yyyy") : "-"}
            </span>
            <span className="text-xs text-muted-foreground">{row.original.paymentTerms}</span>
          </div>
        ),
      },
    ];
  }, [screenSize]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data ? Math.ceil(data.total / PAGE_SIZE) : 0,
    onSortingChange: setSorting,
    state: { sorting },
  });

  const handleRowClick = (id: string) => {
    setSearchParams((prev) => {
      prev.set("orderId", id);
      return prev;
    });
  };

  const handleDetailClose = () => {
    setSearchParams((prev) => {
      prev.delete("orderId");
      return prev;
    });
  };

  return {
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
  };
};