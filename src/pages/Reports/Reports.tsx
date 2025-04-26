import { useState, useEffect } from "react"; // Added useEffect import
import { useQuery } from "@tanstack/react-query";
import ReportsTable from "./components/ReportsTable";
import ReportForm from "./components/ReportForm";
import FilterBar from "./components/FilterBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchReports } from "@/api/api";
import { Report } from "@/types";
import { selectUserHasPermission } from "@/store/slice/authSlice";
import { useAppSelector } from "@/store/store";

export default function ReportsPage() {
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const canAddReports = useAppSelector((state) =>
    selectUserHasPermission(state, "add:reports")
  );

  const { data: reports = [], isLoading } = useQuery<Report[], Error>({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  const allUsers = [...new Set(reports.map((r: Report) => r.reportedBy))];

  const handleAdd = (newReport: Report) => {
    setFilteredReports([...filteredReports, newReport]);
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Report</h1>
      <div className="flex justify-between">
        <FilterBar
          setReports={setFilteredReports}
          allReports={reports}
          allUsers={allUsers}
        />
        {canAddReports && <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500">Add New Report</Button>
          </DialogTrigger>
          <DialogContent>
            <ReportForm onAdd={handleAdd} />
          </DialogContent>
        </Dialog>}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <ReportsTable
          reports={filteredReports}
          setReports={setFilteredReports}
        />
      )}
    </div>
  );
}
