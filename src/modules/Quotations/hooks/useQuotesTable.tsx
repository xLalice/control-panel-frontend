import { SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useQuotations } from "./useQuotesQueries";
import { QuotationStatus } from "../quotes.types";
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

    
    return {
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