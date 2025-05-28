import React, { useState } from "react";
import { useAttendance } from "./hooks/useAttendance";
import { AttendanceTable } from "./components/AttendanceTable";
import { IPManagement } from "./components/IPManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CalendarIcon, Download, Search } from "lucide-react";
import { format } from "date-fns";

export default function AdminAttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).toISOString();
  const endDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toISOString();

  const { useAllAttendanceQuery, useSettingsQuery } = useAttendance();
  const { data: allAttendance = [], isLoading } = useAllAttendanceQuery({
    startDate,
    endDate,
    status: status || undefined,
  });

  const { data: settings } = useSettingsQuery();

  const handleExportCSV = () => {
    // Implementation would convert attendance data to CSV
    // and trigger download
    alert("Export functionality would be implemented here");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Attendance Dashboard</h1>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="ip-management">IP Management</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    defaultMonth={date}
                    onMonthChange={setDate}
                    selected={date}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by Employee ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="ON_BREAK">On Break</SelectItem>
                  <SelectItem value="LOGGED_OUT">Logged Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <AttendanceTable
            attendanceRecords={allAttendance}
            isLoading={isLoading}
            isAdmin={true}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab settings={settings} />
        </TabsContent>

        <TabsContent value="ip-management">
          <IPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Settings Tab component (part of admin page)
interface SettingsTabProps {
  settings?: {
    id: string;
    workStartTime: string;
    lateThreshold: number;
    allowRemoteLogin: boolean;
    autoRemindersActive: boolean;
  };
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings }) => {
  const [formValues, setFormValues] = useState({
    workStartTime: settings?.workStartTime || "08:00",
    lateThreshold: settings?.lateThreshold || 15,
    allowRemoteLogin: settings?.allowRemoteLogin || false,
    autoRemindersActive: settings?.autoRemindersActive || true,
  });

  const { useUpdateSettingsMutation } = useAttendance();
  const updateSettingsMutation = useUpdateSettingsMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      ...formValues,
      lateThreshold: Number(formValues.lateThreshold),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Settings</CardTitle>
        <CardDescription>
          Configure system-wide attendance settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="workStartTime">Work Start Time</Label>
            <Input
              id="workStartTime"
              name="workStartTime"
              type="time"
              value={formValues.workStartTime}
              onChange={handleInputChange}
            />
            <p className="text-sm text-gray-500">
              Official start time for the workday
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
            <Input
              id="lateThreshold"
              name="lateThreshold"
              type="number"
              min="0"
              max="60"
              value={formValues.lateThreshold}
              onChange={handleInputChange}
            />
            <p className="text-sm text-gray-500">
              Minutes after work start time before marking as late
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              id="allowRemoteLogin"
              name="allowRemoteLogin"
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={formValues.allowRemoteLogin}
              onChange={handleInputChange}
            />
            <Label htmlFor="allowRemoteLogin">Allow Remote Login</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            When enabled, employees can clock in from outside designated IP
            addresses
          </p>

          <div className="flex items-center space-x-2">
            <input
              id="autoRemindersActive"
              name="autoRemindersActive"
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={formValues.autoRemindersActive}
              onChange={handleInputChange}
            />
            <Label htmlFor="autoRemindersActive">Automatic Reminders</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            When enabled, the system will send reminders to clock in/out
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
          className="mt-6"
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};