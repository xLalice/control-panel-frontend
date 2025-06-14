import { Priority } from "./types";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Low:
      return "bg-slate-50 text-slate-700 border-slate-200";
    case Priority.Medium:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case Priority.High:
      return "bg-amber-50 text-amber-700 border-amber-200";
    case Priority.Urgent:
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const formatDate = (date: string | Date) => {
    if (!date) return "Not set";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };