import { Badge } from "@/components/ui";
import { InquiryStatus } from "../types";

export const InquiryStatusBadge = ({ status }: { status: InquiryStatus }) => {
  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.New:
        return "bg-sky-100 text-sky-800 border-sky-300";
      case InquiryStatus.Reviewed:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case InquiryStatus.ConvertedToLead:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case InquiryStatus.AssociatedToClient:
        return "bg-teal-100 text-teal-800 border-teal-300";
      case InquiryStatus.Closed:
        return "bg-red-100 text-red-800 border-red-300";
      case InquiryStatus.QuotationGenerated:
        return "bg-amber-100 text-amber-800 border-amber-300";
      case InquiryStatus.DeliveryScheduled:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const displayStatus = (string: string) =>
    string.replace(/([A-Z])/g, " $1").trim();

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} font-medium`}
    >
      {displayStatus(status)}
    </Badge>
  );
};
