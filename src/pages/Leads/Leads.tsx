import { useEffect, useState, useRef } from "react";
import { fetchLead, fetchSheetNames } from "../../api/api";
import { Loader2, AlertCircle } from "lucide-react";

type SheetName =
  | "Manufacturer"
  | "Construction Database"
  | "Batching Plant Database"
  | "PCAB ONLINE"
  | "NCR"
  | `REGION ${string}`;

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    if (activeTab) fetchLeads(activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Close dropdown when clicking outside
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
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownOpen]);

  const fetchLeads = async (sheetName: string, isRefresh = false) => {
    try {
      setLoading(true); // Show loading spinner when switching tabs
      const response = await fetchLead(sheetName);
      setLeads(response.leads || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false); // Hide loading spinner after data is fetched
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
    fetchLeads(activeTab, true);
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
                <tr
                  key={index}
                  className="transition-colors hover:bg-amber-50"
                >
                  {orderedColumns.map((key) => (
                    <td
                      key={key}
                      className="px-4 py-3 text-sm text-black/80 whitespace-nowrap"
                    >
                      {lead[key] || "-"}
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