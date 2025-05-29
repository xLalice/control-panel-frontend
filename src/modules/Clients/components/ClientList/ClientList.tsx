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
import { FormMode } from "../ClientForm/client.schema";
import { ActionsDropdown } from "./components/ActionsDropdown";

export const ClientList = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | ClientStatus>("all");
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients, refetch } = useQuery<Client[], Error>({
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
              className="h-auto p-2 font-bold text-left my-0 hover:bg-muted/50"
            >
              Client Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const client = row.original;
          return (
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setSelectedClient(client);
                  setFormMode("view");
                  setFormIsOpen(true);
                }}
                className="font-medium text-left hover:text-primary transition-colors cursor-pointer"
              >
                {client.clientName}
              </button>
              {client.accountNumber && (
                <div className="text-sm text-muted-foreground">
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
              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{company.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
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
                  <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                  <a
                    href={`mailto:${client.primaryEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {client.primaryEmail}
                  </a>
                </div>
              )}
              {client.primaryPhone && (
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                  <a
                    href={`tel:${client.primaryPhone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {client.primaryPhone}
                  </a>
                </div>
              )}
              {!client.primaryEmail && !client.primaryPhone && (
                <span className="text-muted-foreground text-sm">
                  No contact info
                </span>
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
          return (
            <div className="text-sm">
              {location || <span className="text-muted-foreground">—</span>}
            </div>
          );
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
              className="h-auto p-2 font-bold text-left hover:bg-muted/50"
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionsDropdown
            client={row.original}
            setFormIsOpen={setFormIsOpen}
            setFormMode={setFormMode}
            setSelectedClient={setSelectedClient}
            refetch={refetch}
          />
        ),
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

  const handleCreateClient = () => {
    setSelectedClient(null);
    setFormMode("create");
    setFormIsOpen(true);
  };

  const handleFormSuccess = () => {
    setFormIsOpen(false);
    setSelectedClient(null);
    refetch(); // Refresh the client list
  };

  const handleFormClose = () => {
    setFormIsOpen(false);
    setSelectedClient(null);
  };

  const handleEditFromView = () => {
    setFormMode("edit");
  };

  const clientsCount = clients?.length || 0;
  const filteredCount = filteredData.length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and information
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{clientsCount} total clients</span>
            {statusFilter !== "all" && (
              <span>
                • {filteredCount} {statusFilter} clients
              </span>
            )}
          </div>
        </div>

        <Button onClick={handleCreateClient} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TableFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold">
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
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
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
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Building className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {statusFilter === "all"
                          ? "No clients found."
                          : `No ${statusFilter} clients found.`}
                      </p>
                      {globalFilter && (
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filter criteria.
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination table={table} />
      </div>

      <ClientForm
        client={selectedClient || undefined}
        mode={formMode}
        onSuccess={handleFormSuccess}
        onClose={handleFormClose}
        onEdit={handleEditFromView}
        isOpen={formIsOpen}
        setIsOpen={setFormIsOpen}
      />
    </div>
  );
};
