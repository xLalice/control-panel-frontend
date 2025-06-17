import {  parseISO, differenceInMinutes, differenceInHours } from 'date-fns';

export function calculateDuration(startTime?: string, endTime?: string): string {
  if (!startTime || !endTime) return '--:--';
  
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  
  const minutes = differenceInMinutes(end, start);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
}

export function calculateTotalHours(startTime?: string, endTime?: string): number | null {
  if (!startTime || !endTime) return null;
  
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  
  return parseFloat((differenceInHours(end, start) + (differenceInMinutes(end, start) % 60) / 60).toFixed(2));
}

export function getStatusColor(status: string): string {
  switch(status) {
    case 'PRESENT':
      return 'bg-green-100 text-green-800';
    case 'LATE':
      return 'bg-yellow-100 text-yellow-800';
    case 'ON_BREAK':
      return 'bg-blue-100 text-blue-800';
    case 'LOGGED_OUT':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusBadgeColor(status: string): { bg: string, text: string } {
  switch(status) {
    case 'PRESENT':
      return { bg: 'bg-green-500', text: 'text-white' };
    case 'LATE':
      return { bg: 'bg-yellow-500', text: 'text-white' };
    case 'ON_BREAK':
      return { bg: 'bg-blue-500', text: 'text-white' };
    case 'LOGGED_OUT':
      return { bg: 'bg-gray-500', text: 'text-white' };
    default:
      return { bg: 'bg-gray-500', text: 'text-white' };
  }
}

