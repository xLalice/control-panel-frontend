import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Report } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterBarProps {
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  allReports: Report[];
  allUsers: string[];
}

export default function FilterBar({ setReports, allReports, allUsers }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let filteredReports = allReports;

    if (departmentFilter !== "All") {
      filteredReports = filteredReports.filter((r) => r.department === departmentFilter.toUpperCase());
    }

    if (userFilter !== "All") {
      filteredReports = filteredReports.filter((r) => r.reportedBy === userFilter);
    }

    if (debouncedSearch) {
      filteredReports = filteredReports.filter((r) =>
        r.taskDetails.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setReports(filteredReports);
  }, [debouncedSearch, departmentFilter, userFilter, allReports, setReports]);

  return (
    <div className="flex space-x-4">
      {/* Department Filter */}
      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-40">Filter by Department</SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Departments</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
          <SelectItem value="HR">HR</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* User Filter */}
      <Select value={userFilter} onValueChange={setUserFilter}>
        <SelectTrigger className="w-40">Filter by User</SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Users</SelectItem>
          {allUsers.map((user) => (
            <SelectItem key={user} value={user}>
              {user}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search task details..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
