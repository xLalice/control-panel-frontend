
import { Button } from "@/components/ui";
import { EllipsisVertical, Eye, FileText, Pencil } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { BadgeStatus } from "../components/BadgeStatus";
import { Link } from "react-router-dom";
import { SortableHeader } from "@/components/SortableHeader";
import { Quotation } from "../quotes.types";
import { ColumnDef } from "@tanstack/react-table";

export const quotationColumns: ColumnDef<Quotation>[] = [
    {
        accessorKey: "quotationNumber",
        header: ({ column }) => <SortableHeader column={column} title="Quote #" />,
        cell: ({ row }) => (
            <Link
                to={`/sales/quotations/${row.original.id}`}
                className="font-medium text-blue-600 hover:underline"
            >
                {row.original.quotationNumber}
            </Link>
        ),
    },
    {
        id: "customer",
        accessorFn: (row) => row.client?.clientName || row.lead?.name,
        header: ({ column }) => <SortableHeader column={column} title="Customer" />,
        cell: ({ getValue }) => (
            <span className="truncate max-w-[200px] block" title={getValue() as string} >
                {getValue() as string}
            </span>
        ),
    },
    {
        accessorKey: "validUntil",
        header: ({ column }) => <SortableHeader column={column} title="Valid Until" />,
        cell: ({ row }) => {
            const date = new Date(row.original.validUntil);
            return <span>{date.toLocaleDateString()} </span>;
        },
    },
    {
        accessorKey: "total",
        header: ({ column }) => <SortableHeader column={column} title="Total" />,
        cell: ({ row }) => (
            <div className="font-mono flex" >
                ₱{row.original.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column} title="Status" />,
        cell: ({ row }) => <BadgeStatus status={row.original.status} />,
    },
    {
        accessorKey: 'actions',
        header: "Actions",
        cell: ({ row }) => (
            <Popover>
                <PopoverTrigger asChild >
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" >
                        <span className="sr-only" > Open menu </span>
                        < EllipsisVertical className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                < PopoverContent align="end" className="w-[160px] p-2" >
                    <div className="flex flex-col gap-1" >
                        <Link
                            to={`/sales/quotations/${row.original.id}`}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View
                        </Link>
                        < Link
                            to={`/sales/quotations/${row.original.id}/edit`
                            }
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                        < button
                            onClick={() => console.log('Download PDF', row.original.id)}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted text-left"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }
]