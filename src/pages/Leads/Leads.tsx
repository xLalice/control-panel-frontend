import { useEffect, useState, useRef } from "react";
import {
  fetchLead,
  fetchSheetNames,
  updateLead,
  fetchUsers,
} from "../../api/api";
import { Loader2, AlertCircle, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "../../types";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  pageSize: number;
}
function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue];
}

type SheetName =
  | "Manufacturer"
  | "Construction Database"
  | "Batching Plant Database"
  | "PCAB ONLINE"
  | "NCR"
  | `REGION ${string}`;

// Define the Lead type based on all possible columns
interface Lead {
  id: string;
  [key: string]: string; // Allow any string key with string value
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [isRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    column: string;
    originalValue: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 0,
    totalLeads: 0,
    pageSize: 20,
  });
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const editInputRef = useRef<HTMLInputElement>(null);
  const editSelectRef = useRef<HTMLSelectElement>(null);

  const LEAD_STATUSES = ["New", "InProgress", "Converted", "Closed"];

  const columnPriority: Record<SheetName, string[]> = {
    Manufacturer: [
      "Company Name",
      "Contact or landline",
      "Email",
      "Location",
      "Website",
    ],
    "Construction Database": [
      "Company Name",
      "Email",
      "Region",
      "Category",
      "Address",
    ],
    "Batching Plant Database": [
      "Name",
      "Email",
      "Contact Number",
      "Region",
      "Kind",
    ],
    "PCAB ONLINE": [
      "Name Of Firm",
      "Contact Person",
      "Email",
      "Contact Number",
      "License Number",
      "Region",
    ],
    NCR: [
      "Name Of Firm",
      "License Number",
      "Region",
      "Category",
      "Principal Classification",
      "Type",
      "CFY",
      "Valid From",
      "Valid To",
      "Reg.For Gov.Infra.Projects",
    ],
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetchSheetNames();
        const names = response || [];
        setSheetNames(names);
        console.log("Sheet Names", sheetNames);
        // Set the first non-region tab as the active tab by default
        const defaultTab =
          names.find((name: string) => !name.includes("REGION")) || names[0];
        if (defaultTab) setActiveTab(defaultTab);
      } catch (err) {
        setError("Failed to fetch sheet names");
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  useEffect(() => {
    if (activeTab) {
      fetchLeads(
        activeTab,
        debouncedSearch,
        status,
        startDate,
        endDate,
        assignedTo,
        pagination.currentPage
      );
    }
  }, [
    activeTab,
    debouncedSearch,
    startDate,
    endDate,
    status,
    assignedTo,
    pagination.currentPage,
  ]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (editingCell) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingCell, editValue]);

  useEffect(() => {
    const getUserNames = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data.map((user: User) => user.name));
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    getUserNames();
  }, []);

  const fetchLeads = async (
    sheetName: string,
    search: string = "",
    status: string = "",
    startDate: string = "",
    endDate: string = "",
    assignedTo: string = "",
    page: number = 1
  ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (search.trim()) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (status) queryParams.append("status", status);
      if (endDate) queryParams.append("endDate", endDate);
      if (assignedTo) queryParams.append("assignedTo", assignedTo);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "20"); // Default page size

      console.log("Query params:", queryParams.toString());

      const response = await fetchLead(sheetName, queryParams.toString());
      setLeads(response.leads || []);
      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalLeads: 0,
          pageSize: 20,
        }
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const getOrderedColumns = (columns: string[], sheetName: string) => {
    const isRegion = sheetName.startsWith("REGION") || sheetName === "NCR";
    const priority = isRegion
      ? columnPriority["NCR"]
      : (Object.keys(columnPriority) as string[]).includes(sheetName)
      ? columnPriority[sheetName as keyof typeof columnPriority]
      : [];

    const remainingColumns = columns.filter((col) => !priority.includes(col));
    return [...priority, ...remainingColumns];
  };

  const orderedColumns =
    leads.length > 0
      ? getOrderedColumns(
          Object.keys(leads[0]),
          activeTab in columnPriority ? activeTab : "NCR"
        )
      : [];

  const handleRefresh = () => {
    fetchLeads(activeTab, debouncedSearch);
  };

  const nonRegionTabs = sheetNames.filter(
    (name) =>
      !name.includes("REGION") && name !== "NCR" && !name.includes("Region")
  );
  const regionTabs = sheetNames.filter(
    (name) =>
      name.includes("REGION") || name === "NCR" || name.includes("Region")
  );

  if (loading && !activeTab) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const handleCellClick = (row: number, column: string, value: string) => {
    // Don't allow editing if already editing another cell
    if (editingCell) return;

    setEditingCell({ row, column, originalValue: value });
    setEditValue(value);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      // Cancel editing and revert to original value
      setEditingCell(null);
      setEditValue("");
    } else if (e.key === "Enter") {
      handleSaveEdit();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCell) return;

    try {
      const updatedLeads = [...leads];
      const lead = updatedLeads[editingCell.row];

      // Only proceed if the value has actually changed
      if (editValue !== editingCell.originalValue) {
        // Update the UI immediately for better UX
        lead[editingCell.column] = editValue;
        setLeads(updatedLeads);

        // Attempt to save to backend
        await updateLead(activeTab, lead.id, {
          [editingCell.column]: editValue,
        });
      }
    } catch (error) {
      // If save fails, revert the change
      const updatedLeads = [...leads];
      updatedLeads[editingCell.row][editingCell.column] =
        editingCell.originalValue;
      setLeads(updatedLeads);

      setError("Failed to save changes. Please try again.");
    } finally {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    // Check both input and select refs
    if (
      (editInputRef.current &&
        !editInputRef.current.contains(e.target as Node)) ||
      (editSelectRef.current &&
        !editSelectRef.current.contains(e.target as Node))
    ) {
      handleSaveEdit();
    }
  };

  const handleDateChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
    };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  return (
    <div className="p-6 bg-black/5 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/10">
        <div>
          <h2 className="text-3xl font-bold text-black/90 mb-2">
            Leads Dashboard
          </h2>
          <p className="text-black/60">
            Manage and track your leads across different databases
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 
            bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh Leads"
          )}
        </button>
      </div>

      <div className="mb-6 bg-black/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-black/70">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
          </div>
          {/* Clear filters button */}
          {(searchQuery || status || assignedTo || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatus("");
                setAssignedTo("");
                setStartDate("");
                setEndDate("");
              }}
              className="flex items-center gap-1 text-black/60 hover:text-black/90 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="text-sm">Clear Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/20 
                focus:outline-none focus:ring-2 focus:ring-amber-500
                placeholder-black/50"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 
                text-black/40 h-5 w-5"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-black/20 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          {/* Assigned To Dropdown */}
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-black/20 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Users</option>
            {users.map((userName) => (
              <option key={userName} value={userName}>
                {userName}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={handleDateChange(setStartDate)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/20 
                focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleDateChange(setEndDate)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/20 
                focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-6 flex gap-2">
        {/* Non-Region Tabs */}
        {nonRegionTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
              ${
                activeTab === tab
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-black/5 text-black/70 hover:bg-black/10"
              }`}
          >
            {tab}
          </button>
        ))}

        {/* Region Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 
              ${
                isDropdownOpen
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-black/5 text-black/70 hover:bg-black/10"
              }`}
          >
            Regions
            <span className="text-xs bg-black/10 px-2 py-0.5 rounded">
              {regionTabs.length}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-56 bg-white border border-black/10 shadow-lg rounded-lg overflow-hidden">
              {regionTabs.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setActiveTab(region);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-all duration-200 
                    hover:bg-amber-50 ${
                      activeTab === region
                        ? "bg-amber-100 text-black"
                        : "text-black/80"
                    }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3 border border-red-200">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : leads.length > 0 ? (
          <>
            <table className="table-auto w-full divide-y divide-black/10">
              <thead>
                <tr className="bg-black text-white">
                  {orderedColumns.map((column) => (
                    <th
                      key={column}
                      className="px-4 py-3 text-left text-sm font-medium tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {leads.map((lead, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-amber-50"
                  >
                    {orderedColumns.map((key) => (
                      <td
                        key={key}
                        className={`px-4 py-3 text-sm text-black/80 whitespace-nowrap ${
                          editingCell?.row === index &&
                          editingCell.column === key
                            ? "p-0"
                            : "cursor-pointer hover:bg-amber-50"
                        }`}
                        onClick={() => handleCellClick(index, key, lead[key])}
                      >
                        {editingCell?.row === index &&
                        editingCell.column === key &&
                        key === "status" ? (
                          <select
                            ref={editSelectRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            className="w-full h-full px-4 py-3 border-2 border-amber-500 rounded-none focus:outline-none focus:ring-0"
                            autoFocus
                          >
                            {LEAD_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : editingCell?.row === index &&
                          editingCell.column === key ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full h-full px-4 py-3 border-2 border-amber-500 rounded-none focus:outline-none focus:ring-0"
                            autoFocus
                          />
                        ) : (
                          <span className="block w-full truncate">
                            {lead[key] || "-"}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 bg-black/5">
              <div className="text-sm text-black/60">
                Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
                -{" "}
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalLeads
                )}{" "}
                of {pagination.totalLeads} leads
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-black/70">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-black/60">
            No data available for the selected sheet.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
