import { ColumnDef } from "@tanstack/react-table";
import { Quotation } from "../quotes.types";
import { BadgeStatus } from "../components/BadgeStatus";
import { SortableHeader } from "@/components/SortableHeader";

interface ColumnActions {
    onDownload: (id: string, quoteNumber: string) => void;
    onRowClick: (id: string) => void;
}

export const getQuotationColumns = (actions: ColumnActions): ColumnDef<Quotation>[] => [
    {
        accessorKey: "quotationNumber",
        header: ({ column }) => <SortableHeader column={column} title="Quote #" />,
        cell: ({ row }) => (
            <span onClick={() => actions.onRowClick(row.original.id)} className="text-blue-600 cursor-pointer">
                {row.original.quotationNumber}
            </span>
        ),
    },
    {
        id: "customer",
        accessorFn: (row) => row.client?.clientName || row.lead?.name,
        header: ({ column }) => <SortableHeader column={column} title="Customer" />,
        cell: ({ getValue }) => (
            <span className="truncate max-w-[200px] block" title={getValue() as string}>
                {getValue() as string}
            </span>
        ),
    },
    {
        accessorKey: "validUntil",
        header: ({ column }) => <SortableHeader column={column} title="Valid Until" />,
        cell: ({ row }) => {
            const date = new Date(row.original.validUntil);
            return <span>{date.toLocaleDateString()}</span>;
        },
    },
    {
        accessorKey: "total",
        header: ({ column }) => <SortableHeader column={column} title="Total" />,
        cell: ({ row }) => (
            <div className="font-mono flex justify-end">
                ₱{row.original.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column} title="Status" />,
        cell: ({ row }) => <BadgeStatus status={row.original.status} />,
    },
];