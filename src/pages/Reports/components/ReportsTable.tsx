import { useState } from "react";
import { deleteReport } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import DeleteDialog from "./DeleteDialog";
import { Report } from "@/types";
import { updateReport } from "@/api/api";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ReportsTableProps {
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function ReportsTable({
  reports,
  setReports,
}: ReportsTableProps) {
  const [, setSelectedReport] = useState<Report | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReport, setEditedReport] = useState<Partial<Report>>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleEditClick = (report: Report) => {
    setEditingId(report.id);
    setEditedReport(report);
  };

  const handleInputChange = (field: keyof Report, value: string) => {
    setEditedReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editingId || !editedReport) return;

    const updatedReport = await updateReport(editingId, editedReport);
    setReports(
      reports.map((r) => (r.id === editingId ? { ...r, ...updatedReport } : r))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedReport({});
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setReports(
      [...reports].sort((a, b) =>
        newOrder === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime()
      )
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2"
            >
              Date{" "}
              {sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
            </button>
          </TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Task Details</TableHead>
          <TableHead>Reported By:</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              {editingId === report.id ? (
                <Input
                  type="date"
                  value={
                    new Date(editedReport.date || report.date)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              ) : (
                new Date(report.date).toLocaleDateString()
              )}
            </TableCell>
            <TableCell>{report.department}</TableCell>
            <TableCell>
              {editingId === report.id ? (
                <Input
                  type="text"
                  value={editedReport.taskDetails || report.taskDetails}
                  onChange={(e) =>
                    handleInputChange("taskDetails", e.target.value)
                  }
                />
              ) : (
                report.taskDetails
              )}
            </TableCell>
            <TableCell>{report.reportedBy || "Unknown"}</TableCell>
            <TableCell className="text-right space-x-2">
              <div className="flex gap-2">
                {editingId === report.id ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(report)}
                    >
                      Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DeleteDialog
                          report={report}
                          onDelete={() => handleDelete(report.id)}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
