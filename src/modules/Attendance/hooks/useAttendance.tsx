import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { attendanceApi } from '../attendance.api';

export function useAttendance() {
  const queryClient = useQueryClient();
  const [currentDate] = useState(new Date());
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

  const useUserAttendanceQuery = (params?: { startDate?: string; endDate?: string; userId?: string }) => {
    return useQuery({
      queryKey: ['userAttendance', params?.startDate || startOfMonth, params?.endDate || endOfMonth, params?.userId],
      queryFn: () => attendanceApi.getUserAttendance({
        startDate: params?.startDate || startOfMonth,
        endDate: params?.endDate || endOfMonth,
        userId: params?.userId
      })
    });
  };

  // Admin queries
  const useAllAttendanceQuery = (params?: { startDate?: string; endDate?: string; status?: string }) => {
    return useQuery({
      queryKey: ['allAttendance', params?.startDate || startOfMonth, params?.endDate || endOfMonth, params?.status],
      queryFn: () => attendanceApi.getAllAttendance({
        startDate: params?.startDate || startOfMonth,
        endDate: params?.endDate || endOfMonth,
        status: params?.status
      })
    });
  };

  const useSettingsQuery = () => {
    return useQuery({
      queryKey: ['dtrSettings'],
      queryFn: attendanceApi.getSettings
    });
  };

  const useAllowedIPsQuery = (userId?: string) => {
    return useQuery({
      queryKey: ['allowedIPs', userId],
      queryFn: () => attendanceApi.getAllowedIPs(userId)
    });
  };

  // Mutations
  const useClockInMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.clockIn,
      onSuccess: () => {
        toast.success('Successfully clocked in');
        queryClient.invalidateQueries({ queryKey: ['userAttendance'] });
      }
    });
  };

  const useClockOutMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.clockOut,
      onSuccess: () => {
        toast.success('Successfully clocked out');
        queryClient.invalidateQueries({ queryKey: ['userAttendance'] });
      }
    });
  };

  const useStartBreakMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.startBreak,
      onSuccess: () => {
        toast.success('Break started');
        queryClient.invalidateQueries({ queryKey: ['userAttendance'] });
      }
    });
  };

  const useEndBreakMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.endBreak,
      onSuccess: () => {
        toast.success('Break ended');
        queryClient.invalidateQueries({ queryKey: ['userAttendance'] });
      }
    });
  };

  const useUpdateSettingsMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.updateSettings,
      onSuccess: () => {
        toast.success('Settings updated successfully');
        queryClient.invalidateQueries({ queryKey: ['dtrSettings'] });
      }
    });
  };

  const useManageAllowedIPsMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.manageAllowedIPs,
      onSuccess: () => {
        toast.success('IP whitelist updated successfully');
        queryClient.invalidateQueries({ queryKey: ['allowedIPs'] });
      }
    });
  };

  return {
    useUserAttendanceQuery,
    useAllAttendanceQuery,
    useSettingsQuery,
    useAllowedIPsQuery,
    useClockInMutation,
    useClockOutMutation,
    useStartBreakMutation,
    useEndBreakMutation,
    useUpdateSettingsMutation,
    useManageAllowedIPsMutation
  };
}