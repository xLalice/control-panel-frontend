import React from "react";
import { Button } from "@/components/ui/button";
import { useAttendance } from "../hooks/useAttendance";
import { Attendance, AttendanceStatus } from "../types";
import { Play, Pause, Clock, Coffee } from "lucide-react";

interface ClockButtonProps {
  currentAttendance?: Attendance | null;
  onBreakClick?: () => void;
}

export const ClockButton: React.FC<ClockButtonProps> = ({
  currentAttendance,
  onBreakClick,
}) => {
  const { useClockInMutation, useClockOutMutation, useEndBreakMutation } =
    useAttendance();

  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();
  const endBreakMutation = useEndBreakMutation();

  const handleAction = () => {
    if (
      !currentAttendance ||
      currentAttendance.status === AttendanceStatus.LOGGED_OUT
    ) {
      clockInMutation.mutate();
    } else if (currentAttendance.status === AttendanceStatus.ON_BREAK) {
      endBreakMutation.mutate();
    } else {
      clockOutMutation.mutate();
    }
  };

  // Determine button appearance based on current attendance status
  const getButtonProps = () => {
    if (
      !currentAttendance ||
      currentAttendance.status === AttendanceStatus.LOGGED_OUT
    ) {
      return {
        variant: "default" as const,
        icon: <Clock className="mr-2 h-4 w-4" />,
        text: "Clock In",
        color: "bg-green-600 hover:bg-green-700",
      };
    } else if (currentAttendance.status === AttendanceStatus.ON_BREAK) {
      return {
        variant: "outline" as const,
        icon: <Play className="mr-2 h-4 w-4" />,
        text: "End Break",
        color: "border-blue-500 text-blue-500 hover:bg-blue-50",
      };
    } else {
      return {
        variant: "destructive" as const,
        icon: <Pause className="mr-2 h-4 w-4" />,
        text: "Clock Out",
        color: "",
      };
    }
  };

  const buttonProps = getButtonProps();
  const isPresent =
    currentAttendance &&
    currentAttendance.status !== AttendanceStatus.LOGGED_OUT;
  const isOnBreak = currentAttendance?.status === AttendanceStatus.ON_BREAK;

  return (
    <div className="flex space-x-2">
      <Button
        variant={buttonProps.variant}
        onClick={handleAction}
        disabled={
          clockInMutation.isPending ||
          clockOutMutation.isPending ||
          endBreakMutation.isPending
        }
        className={buttonProps.color}
      >
        {buttonProps.icon}
        {buttonProps.text}
      </Button>

      {isPresent && !isOnBreak && (
        <Button
          variant="outline"
          onClick={onBreakClick}
          className="border-amber-500 text-amber-500 hover:bg-amber-50"
        >
          <Coffee className="mr-2 h-4 w-4" />
          Take Break
        </Button>
      )}
    </div>
  );
};
