import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import { useQuotations } from "./useQuotesQueries";
import { Quotation, QuotationStatus } from "../quotes.types";
import { BadgeStatus } from "../components/BadgeStatus";
import { Link } from "react-router-dom";
import { SortableHeader } from "@/components/SortableHeader";
import { useDebounce } from "@/hooks/useDebounce";

export const useQuotesTable = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [status, setStatus] = useState<QuotationStatus | "ALL">("ALL");
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const debouncedSearch = useDebounce(searchTerm, 500);



    const sortParam = sorting
        .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
        .join(",");

    const { data, isLoading } = useQuotations({
        page: page.toString(),
        sort: sortParam || undefined,
        ...(status !== 'ALL' && { status }),
        ...(debouncedSearch && { search: debouncedSearch })
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const columns = useMemo<ColumnDef<Quotation>[]>(
        () => [
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
                    <div className="font-mono flex">
                        ₱{row.original.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: ({ column }) => <SortableHeader column={column} title="Status" />,
                cell: ({ row }) => <BadgeStatus status={row.original.status} />,
            },
        ],
        []
    );

    return {
        columns,
        data: data?.data || [],
        meta: data?.meta,
        isLoading,
        page,
        setPage,
        sorting,
        setSorting,
        status,
        setStatus,
        searchTerm,
        setSearchTerm
    };
};