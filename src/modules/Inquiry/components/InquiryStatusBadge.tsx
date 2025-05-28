import { Badge } from '@/components/ui/badge';

// Assuming this enum is defined in a types file or within this file
enum InquiryStatus {
  New = 'New',
  Quoted = 'Quoted',
  Approved = 'Approved',
  Scheduled = 'Scheduled',
  Fulfilled = 'Fulfilled',
  Cancelled = 'Cancelled',
}

interface InquiryStatusBadgeProps {
  status: InquiryStatus;
}

export const InquiryStatusBadge: React.FC<InquiryStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case InquiryStatus.New:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">New</Badge>;
    case InquiryStatus.Quoted:
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Quoted</Badge>;
    case InquiryStatus.Approved:
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case InquiryStatus.Scheduled:
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Scheduled</Badge>;
    case InquiryStatus.Fulfilled:
      return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Fulfilled</Badge>;
    case InquiryStatus.Cancelled:
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};