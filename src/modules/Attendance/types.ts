import { User } from "@/types/sharedTypes";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  LATE = "LATE",
  ON_BREAK = "ON_BREAK",
  LOGGED_OUT = "LOGGED_OUT",
}

export type BreakLog = {
  id: string;
  attendanceId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  reason?: string;
};

export type Attendance = {
  id: string;
  userId: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  status: string;
  totalHours?: number;
  ipAddress?: string;
  device?: string;
  notes?: string;
  breakLogs: BreakLog[];
  user?: User;
};

export type AllowedIP = {
  id: string;
  userId: string;
  ipAddress: string;
  description?: string;
  createdAt: string;
};

export type DTRSettings = {
  id: string;
  workStartTime: string;
  lateThreshold: number;
  allowRemoteLogin: boolean;
  autoRemindersActive: boolean;
  updatedById: string;
  updatedAt: string;
};
