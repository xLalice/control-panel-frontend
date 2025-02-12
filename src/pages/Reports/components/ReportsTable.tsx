import { useState } from "react";
import { deleteReport } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import DeleteDialog from "./DeleteDialog";
import { Report } from "@/types";

interface ReportsTableProps {
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function ReportsTable({ reports, setReports }: ReportsTableProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Date</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Task Details</TableHead>
          <TableHead>Reported By:</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
            <TableCell>{report.department}</TableCell>
            <TableCell>{report.taskDetails}</TableCell>
            <TableCell>{report.reportedBy}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" onClick={() => setSelectedReport(report)}>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DeleteDialog report={selectedReport} onDelete={handleDelete} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
