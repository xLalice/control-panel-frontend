import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api";
import { Client, ClientStatus } from "../../clients.schema";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, ArrowUpDown, Plus } from "lucide-react";
import { StatusBadge } from "./components/StatusBadge";
import { ActionsDropdown } from "./components/ActionsDropdown";
import { TablePagination } from "./components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableFilters } from "./components/TableFilters";
import { ClientForm } from "../ClientForm/ClientForm";

export const ClientList = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | ClientStatus>("all");
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: clients } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await apiClient.get("/clients");
      return response.data;
    },
  });

  const columnHelper = createColumnHelper<Client>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("clientName", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 font-semibold text-left"
            >
              Client Name
            </Button>
          );
        },
        cell: ({ row }) => {
          const client = row.original;
          return (
            <div className="flex flex-col">
              <div className="font-medium">{client.clientName}</div>
              {client.accountNumber && (
                <div className="text-sm text-gray-500">
                  {client.accountNumber}
                </div>
              )}
            </div>
          );
        },
      }),

      columnHelper.accessor("company", {
        header: "Company",
        cell: ({ getValue }) => {
          const company = getValue();
          return company ? (
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4 text-gray-400" />
              {company.name}
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      }),
      columnHelper.accessor("primaryEmail", {
        header: "Contact",
        cell: ({ row }) => {
          const client = row.original;
          return (
            <div className="flex flex-col space-y-1">
              {client.primaryEmail && (
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-3 w-3 text-gray-400" />
                  {client.primaryEmail}
                </div>
              )}
              {client.primaryPhone && (
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-3 w-3 text-gray-400" />
                  {client.primaryPhone}
                </div>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("billingAddressCity", {
        header: "Location",
        cell: ({ row }) => {
          const client = row.original;
          const location = [
            client.billingAddressCity,
            client.billingAddressRegion,
            client.billingAddressCountry,
          ]
            .filter(Boolean)
            .join(", ");
          return location || <span className="text-gray-400">—</span>;
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
        filterFn: (row, id, value) => {
          if (value === "all") return true;
          return row.getValue(id) === value;
        },
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 font-semibold text-left"
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return date.toLocaleDateString();
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsDropdown client={row.original} />,
      }),
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!clients) return [];
    if (statusFilter === "all") return clients;
    return clients.filter((client) => client.status === statusFilter);
  }, [statusFilter, clients]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleFormSuccess = () => {
    setFormIsOpen(false);
  };

  const handleFormClose = () => {
    setFormIsOpen(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Clients
          </h1>
          <p className="text-gray-600">
            Manage your client relationships and information
          </p>
        </div>

        <Button onClick={() => setFormIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <TableFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination table={table} />
      </div>

      {formIsOpen && (
        <ClientForm
          onSuccess={handleFormSuccess}
          onClose={handleFormClose}
          isOpen={formIsOpen}
          setIsOpen={setFormIsOpen}
        />
      )}
    </div>
  );
};
