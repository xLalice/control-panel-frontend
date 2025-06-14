import { Badge } from "@/components/ui";

export const InquiryStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "Quoted":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Approved":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "Scheduled":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Fulfilled":
        return "bg-stone-100 text-stone-800 border-stone-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} font-medium`}
    >
      {status}
    </Badge>
  );
};