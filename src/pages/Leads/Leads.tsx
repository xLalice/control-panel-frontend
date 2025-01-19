import { useEffect, useState } from "react";
import { fetchLead } from "../../api/api";
import { TAB_NAMES } from "../../constants/constants";

interface Lead {
  [key: string]: string; // Each lead object can have varying columns
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Manufacturer"); // Default tab

  // Fetch leads for the selected sheet
  const fetchLeads = async (sheetName: string) => {
    try {
      setLoading(true);
      const response = await fetchLead(sheetName); // API call for specific sheet
      console.log("Response: ", response)
      setLeads(response.leads || []); // Ensure leads array is populated
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch leads");
      setLoading(false);
    }
  };

  // Fetch data whenever the active tab changes
  useEffect(() => {
    fetchLeads(activeTab);
  }, [activeTab]);

  if (loading) return <div>Loading leads...</div>;
  if (error) return <div>{error}</div>;

  // Get dynamic column headers
  const columns = leads.length > 0 ? Object.keys(leads[0]) : [];

  return (
    <div className="container mx-auto p-6 bg-black/5 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">Leads Dashboard</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {TAB_NAMES.map((tab) => (
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
      </div>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        {leads.length > 0 ? (
          <table className="w-full divide-y divide-black/10">
            <thead>
              <tr className="bg-black text-white">
                {columns.map((column) => (
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
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-3 text-sm text-black/80 whitespace-nowrap"
                    >
                      {lead[column] || "-"}
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
