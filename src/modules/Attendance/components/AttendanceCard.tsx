import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockButton } from './ClockButton';
import { BreakModal } from './BreakModal';
import { Badge } from '@/components/ui/badge';
import { Attendance } from "../types"
import {  getStatusBadgeColor } from "../utils";
import { formatTime } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';

interface AttendanceCardProps {
  currentAttendance: Attendance | null;
  isLoading: boolean;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  currentAttendance,
  isLoading
}) => {
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { bg, text } = getStatusBadgeColor(currentAttendance?.status || 'LOGGED_OUT');

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daily Time Record</CardTitle>
            <Badge className={`${bg} ${text}`}>
              {currentAttendance?.status || 'LOGGED_OUT'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          {isLoading ? (
            <div className="h-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Time In</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">
                    {formatTime(currentAttendance?.timeIn)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Time Out</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">
                    {formatTime(currentAttendance?.timeOut)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {currentAttendance?.breakLogs && currentAttendance.breakLogs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Breaks Today</p>
              <div className="space-y-2">
                {currentAttendance.breakLogs.map((breakLog) => (
                  <div key={breakLog.id} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex justify-between">
                      <span>{formatTime(breakLog.startTime)}</span>
                      <span>to</span>
                      <span>{formatTime(breakLog.endTime) || 'Ongoing'}</span>
                    </div>
                    {breakLog.reason && (
                      <p className="text-gray-500 mt-1">Reason: {breakLog.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <ClockButton
            currentAttendance={currentAttendance}
            onBreakClick={() => setBreakModalOpen(true)}
          />
        </CardFooter>
      </Card>
      
      <BreakModal
        open={breakModalOpen}
        onOpenChange={setBreakModalOpen}
      />
    </>
  );
};