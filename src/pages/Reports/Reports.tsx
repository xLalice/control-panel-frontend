import { useState, useEffect } from "react";
import ReportsTable from "./components/ReportsTable";
import ReportForm from "./components/ReportForm";
import FilterBar from "./components/FilterBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchReports } from "@/api/api";
import { Report } from "@/types";

export default function ReportsPage() {
  const [originalReports, setOriginalReports] = useState<Report[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchReports().then((data: Report[]) => {
      setOriginalReports(data);
      setReports(data);
      setAllUsers([...new Set(data.map((r) => r.reportedBy))]);
    });
  }, []);

  const handleAdd = (newReport: Report) => {
    setReports([...reports, newReport]);
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reports Module</h1>
      <div className="flex justify-between">
        <FilterBar setReports={setReports} allReports={originalReports} allUsers={allUsers} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Report</Button>
          </DialogTrigger>
          <DialogContent>
            <ReportForm onAdd={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>
      <ReportsTable reports={reports} setReports={setReports} />
    </div>
  );
}
