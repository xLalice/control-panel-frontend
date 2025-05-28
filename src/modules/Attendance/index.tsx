import { useState } from "react";
import { AttendanceCard } from "./components/AttendanceCard";
import { AttendanceTable } from "./components/AttendanceTable";
import { useAttendance } from "./hooks/useAttendance";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
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

  const { useUserAttendanceQuery } = useAttendance();
  const { data: attendanceRecords = [], isLoading } = useUserAttendanceQuery({
    startDate,
    endDate,
  });

  // Get today's attendance record if any
  const today = new Date().toISOString().split("T")[0];
  const currentAttendance =
    attendanceRecords.find((record) => record.date.split("T")[0] === today) ||
    null;

  return (
    <div className="flex justify-center w-full bg-gray-50 min-h-screen">
      <div className="container max-w-6xl py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Attendance Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AttendanceCard
              currentAttendance={currentAttendance}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <Tabs defaultValue="history" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="history" className="px-4">Attendance History</TabsTrigger>
                    <TabsTrigger value="stats" className="px-4">Statistics</TabsTrigger>
                  </TabsList>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-[240px] justify-start text-left font-normal border-gray-200 hover:bg-gray-50"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {format(date, "MMMM yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        defaultMonth={date}
                        onMonthChange={setDate}
                        selected={date}
                        initialFocus
                        className="rounded-md border-0"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <TabsContent value="history" className="space-y-4 mt-2">
                  <AttendanceTable
                    attendanceRecords={attendanceRecords}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="stats" className="mt-2">
                  <div className="rounded-lg border border-gray-100 p-6 bg-gray-50">
                    <h3 className="text-lg font-medium mb-6 text-gray-800">Monthly Statistics</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-blue-600 font-medium mb-1">Total Days</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {attendanceRecords.length}
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-green-600 font-medium mb-1">On Time</p>
                        <p className="text-2xl font-bold text-green-700">
                          {
                            attendanceRecords.filter((r) => r.status === "PRESENT")
                              .length
                          }
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-yellow-600 font-medium mb-1">Late</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {
                            attendanceRecords.filter((r) => r.status === "LATE")
                              .length
                          }
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-purple-600 font-medium mb-1">Total Hours</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {attendanceRecords
                            .reduce((total, r) => total + (r.totalHours || 0), 0)
                            .toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}