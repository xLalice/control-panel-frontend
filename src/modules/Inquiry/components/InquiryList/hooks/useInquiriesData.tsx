import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse, Inquiry } from "@/modules/Inquiry/types";
import { getInquiries } from "@/api/api";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { SortingState } from "@tanstack/react-table";

interface UseInquiryDataProps {
  refreshTrigger: number;
}

export const useInquiriesData = ({ refreshTrigger }: UseInquiryDataProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localSearchInput, setLocalSearchInput] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const debouncedSearchTerm = useDebounce(localSearchInput, 500);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchTerm(debouncedSearchTerm);
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, setSearchTerm, searchTerm]);
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchInput(e.target.value);
  };

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Inquiry>>({
    queryKey: [
      "inquiries",
      currentPage,
      statusFilter,
      searchTerm,
      sorting,
      refreshTrigger,
    ],
    queryFn: async () => {

      const result = await getInquiries({
        page: currentPage,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: 20,
      });
      return result;
    },
  });

  return {
    inquiries: data,
    isLoading,
    isError,
    currentPage,
    setCurrentPage, 
    searchTerm, 
    setSearchTerm, 
    statusFilter,
    setStatusFilter,
    localSearchInput,
    handleSearchInputChange,
    sorting,
    setSorting
  };
};
