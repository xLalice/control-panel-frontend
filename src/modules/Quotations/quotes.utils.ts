import { QuotationStatus } from "./quotes.types";

export const getStatusColor = (status: string) => {
    switch (status) {
      case QuotationStatus.Draft : return "bg-gray-500 hover:bg-gray-600";
      case QuotationStatus.Sent : return "bg-blue-500 hover:bg-blue-600";
      case QuotationStatus.Accepted : return "bg-green-500 hover:bg-green-600";
      case QuotationStatus.Rejected : return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500";
    }
  };