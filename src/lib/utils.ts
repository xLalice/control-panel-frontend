import { clsx, type ClassValue } from "clsx"
import { format, parseISO } from 'date-fns';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(dateString?: string): string {
  if (!dateString) return '--:--';
  return format(parseISO(dateString), 'hh:mm a');
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '--/--/----';
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '--/--/---- --:--';
  return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
}