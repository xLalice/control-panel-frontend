import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Attendance } from "../types";
import {
  calculateDuration,
  getStatusColor,
} from "../utils";
import { formatTime, formatDate } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface AttendanceTableProps {
  attendanceRecords: Attendance[];
  isLoading: boolean;
  isAdmin?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceRecords,
  isLoading,
  isAdmin = false,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead>User</TableHead>}
            <TableHead>Time In</TableHead>
            <TableHead>Time Out</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : attendanceRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                No attendance records found
              </TableCell>
            </TableRow>
          ) : (
            attendanceRecords.map((record) => (
              <React.Fragment key={record.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell>{formatDate(record.date)}</TableCell>
                  {isAdmin && (
                    <TableCell>{record.user?.name || "Unknown"}</TableCell>
                  )}
                  <TableCell>{formatTime(record.timeIn)}</TableCell>
                  <TableCell>{formatTime(record.timeOut)}</TableCell>
                  <TableCell>
                    {calculateDuration(record.timeIn, record.timeOut)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleRowExpand(record.id)}
                        >
                          {expandedRow === record.id
                            ? "Hide details"
                            : "View details"}
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem>Edit record</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {expandedRow === record.id && (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="bg-gray-50 p-4"
                    >
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Additional Details</h4>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500">IP Address</p>
                            <p>{record.ipAddress || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Device</p>
                            <p>{record.device || "N/A"}</p>
                          </div>
                        </div>

                        {record.notes && (
                          <div className="mt-2">
                            <p className="text-gray-500">Notes</p>
                            <p>{record.notes}</p>
                          </div>
                        )}

                        {record.breakLogs && record.breakLogs.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Break Logs</h5>
                            <div className="space-y-2">
                              {record.breakLogs.map((breakLog) => (
                                <div
                                  key={breakLog.id}
                                  className="bg-white p-2 rounded border text-sm"
                                >
                                  <div className="flex justify-between">
                                    <span>
                                      {formatTime(breakLog.startTime)}
                                    </span>
                                    <span>to</span>
                                    <span>
                                      {formatTime(breakLog.endTime) ||
                                        "Ongoing"}
                                    </span>
                                  </div>
                                  {breakLog.duration && (
                                    <p className="text-gray-500">
                                      Duration: {breakLog.duration.toFixed(2)}{" "}
                                      hours
                                    </p>
                                  )}
                                  {breakLog.reason && (
                                    <p className="text-gray-500">
                                      Reason: {breakLog.reason}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
