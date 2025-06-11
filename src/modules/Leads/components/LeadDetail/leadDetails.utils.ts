import { format } from "date-fns";

export const formatDateTime = (date: Date) => {
    try {
      return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return date.toString();
    }
  };