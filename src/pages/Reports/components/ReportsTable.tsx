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
import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";

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

  // Permission checks
  const canReadAllReports = useAppSelector((state) =>
    selectUserHasPermission(state, "read:all_reports")
  );
  const canReadOwnReports = useAppSelector((state) =>
    selectUserHasPermission(state, "read:own_reports")
  );
  const canUpdateAllReports = useAppSelector((state) =>
    selectUserHasPermission(state, "update:all_reports")
  );
  const canUpdateOwnReports = useAppSelector((state) =>
    selectUserHasPermission(state, "update:own_reports")
  );
  const canDeleteAllReports = useAppSelector((state) =>
    selectUserHasPermission(state, "delete:all_reports")
  );

  const currentUser = useAppSelector((state) => state.auth.user);

  const handleDelete = async (id: string) => {
    if (!canDeleteAllReports) return;

    await deleteReport(id);
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleEditClick = (report: Report) => {
    const isOwnReport = report.reportedBy === currentUser?.id;
    if (!(canUpdateAllReports || (canUpdateOwnReports && isOwnReport))) return;

    setEditingId(report.id);
    setEditedReport(report);
  };

  const handleInputChange = (field: keyof Report, value: string) => {
    setEditedReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editingId || !editedReport) return;

    const reportToUpdate = reports.find((r) => r.id === editingId);
    if (!reportToUpdate) return;

    // Check permissions again before saving
    const isOwnReport = reportToUpdate.reportedBy === currentUser?.id;
    if (!(canUpdateAllReports || (canUpdateOwnReports && isOwnReport))) return;

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

  // Filter reports based on permissions
  const visibleReports = reports.filter((report) => {
    if (canReadAllReports) return true;
    if (canReadOwnReports && report.reportedBy === currentUser?.id) return true;
    return false;
  });

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
        {visibleReports.map((report) => {
          const isOwnReport = report.reportedBy === currentUser?.id;
          const canEditThisReport =
            canUpdateAllReports || (canUpdateOwnReports && isOwnReport);
          const canDeleteThisReport = canDeleteAllReports;

          return (
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
                      {canEditThisReport && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(report)}
                        >
                          Edit
                        </Button>
                      )}
                      {canDeleteThisReport && (
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
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
