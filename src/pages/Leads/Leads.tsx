import { useEffect, useState, useRef } from "react";
import { fetchLead, fetchSheetNames, updateLead } from "../../api/api";
import { Loader2, AlertCircle, Search } from "lucide-react";

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
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const editInputRef = useRef<HTMLInputElement>(null);

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
      fetchLeads(activeTab, debouncedSearch, status,  startDate, endDate);
    }
  }, [activeTab, debouncedSearch, startDate, endDate, status]);

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

  const fetchLeads = async (
    sheetName: string,
    search: string = "",
    status: string = "",
    startDate: string = "",
    endDate: string = ""
  ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
  
      if (search.trim()) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (status) queryParams.append("status", status);
      if (endDate) queryParams.append("endDate", endDate);
  
      console.log("Query params:", queryParams.toString());
  
      const response = await fetchLead(sheetName, queryParams.toString());
      setLeads(response.leads || []);
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
    if (
      editInputRef.current &&
      !editInputRef.current.contains(e.target as Node)
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

  return (
    <div className="p-6 bg-black/5 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Leads Dashboard</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 
          bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {/* Non-Region Tabs */}
        {nonRegionTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
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
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDropdownOpen
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                : "bg-black/5 text-black/70 hover:bg-black/10"
            }`}
          >
            Regions
          </button>

          {isDropdownOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-black/10 shadow-lg rounded-lg">
              {regionTabs.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setActiveTab(region);
                    setIsDropdownOpen(false); // Close dropdown after selection
                  }}
                  className={`w-full text-left px-4 py-2 transition-all duration-200 hover:bg-amber-50 ${
                    activeTab === region ? "bg-amber-100" : ""
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-black/10 
                                     focus:outline-none focus:ring-2 focus:ring-amber-500
                                     w-64 pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 
                                         text-black/30 h-5 w-5"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="InProgress">In Progress</option>
          <option value="Converted">Converted</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">All Users</option>
          <option value="John">John</option>
          <option value="Jane">Jane</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={handleDateChange(setStartDate)}
        />
        <input
          type="date"
          value={endDate}
          onChange={handleDateChange(setEndDate)}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : leads.length > 0 ? (
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
                <tr key={index} className="transition-colors hover:bg-amber-50">
                  {orderedColumns.map((key, colIndex) => (
                    <td
                      key={key}
                      className={`px-4 py-3 text-sm text-black/80 whitespace-nowrap ${
                        editingCell?.row === index && editingCell.column === key
                          ? "p-0"
                          : "cursor-pointer hover:bg-amber-50"
                      }`}
                      onClick={() => handleCellClick(index, key, lead[key])}
                    >
                      {editingCell?.row === index &&
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
