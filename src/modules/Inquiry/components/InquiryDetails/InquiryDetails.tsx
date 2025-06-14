import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Package,
  Truck,
  User,
  Building,
  Clock,
  Flag,
  HelpCircle,
  X,
  ExternalLink,
  DollarSign,
  FileText,
  Tag,
  ChevronRight,
  LucideProps,
} from "lucide-react";
import { Inquiry, Priority } from "../../types";
import { useNavigate } from "react-router-dom";
import { getPriorityColor } from "../../inquiry.utils";

interface InquiryDetailProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry;
  onConvertToLead: () => void;
}

const InquiryStatusBadge = ({ status }: { status: string }) => {
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



const InfoRow = ({
  icon: IconComponent,
  label,
  value,
  className = "",
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <IconComponent className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <div className="text-sm text-gray-900 mt-0.5">{value}</div>
    </div>
  </div>
);

export const InquiryDetails = ({
  inquiry,
  onConvertToLead = () => {},
  onClose = () => {},
  isOpen = true,
}: InquiryDetailProps) => {
  const formatDate = (date: string | Date) => {
    if (!date) return "Not set";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const navigate = useNavigate();

  const handleViewLead = () => {
    if (inquiry.relatedLeadId) {
      navigate(`/leads/`, { state: { leadIdToOpen: inquiry.relatedLeadId } });
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[560px] xl:w-[640px] bg-white shadow-2xl z-50 
                   transform transition-all duration-300 ease-out overflow-hidden
                   ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Inquiry details panel"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  Inquiry #{inquiry.id}
                </h2>
                <InquiryStatusBadge status={inquiry.status} />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {inquiry.clientName} • {formatDate(inquiry.createdAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-4 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close panel</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {inquiry.relatedLeadId ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleViewLead}
              >
                <ExternalLink className="h-4 w-4" />
                View Connected Lead
              </Button>
            ) : (
              <Button
                onClick={() => onConvertToLead()}
                size="sm"
                className="flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                Convert to Lead
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow icon={User} label="Name" value={inquiry.clientName} />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={inquiry.phoneNumber}
                />
                <InfoRow icon={Mail} label="Email" value={inquiry.email} />

                {inquiry.isCompany && (
                  <>
                    <Separator className="my-4" />
                    <InfoRow
                      icon={Building}
                      label="Company"
                      value={inquiry.companyName}
                    />
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={inquiry.companyAddress}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Request */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Order Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={Package}
                  label="Product/Service"
                  value={inquiry.product?.name}
                />
                <InfoRow
                  icon={HelpCircle}
                  label="Inquiry Type"
                  value={<Badge variant="outline">{inquiry.inquiryType}</Badge>}
                />
                <InfoRow icon={Tag} label="Quantity" value={inquiry.quantity} />

                {inquiry.priority && (
                  <InfoRow
                    icon={Flag}
                    label="Priority"
                    value={
                      <Badge
                        variant="outline"
                        className={getPriorityColor(
                          inquiry.priority as Priority
                        )}
                      >
                        {inquiry.priority}
                      </Badge>
                    }
                  />
                )}

                {inquiry.dueDate && (
                  <InfoRow
                    icon={Calendar}
                    label="Due Date"
                    value={formatDate(inquiry.dueDate)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={Truck}
                  label="Method"
                  value={inquiry.deliveryMethod}
                />
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={inquiry.deliveryLocation}
                />
                <InfoRow
                  icon={Calendar}
                  label="Preferred Date"
                  value={formatDate(inquiry.preferredDate)}
                />
              </CardContent>
            </Card>

            {/* Quote Information */}
            {inquiry.quotedPrice && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    Quote Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={DollarSign}
                    label="Quoted Price"
                    value={
                      <span className="text-lg font-semibold text-green-600">
                        ${inquiry.quotedPrice.toLocaleString()}
                      </span>
                    }
                  />
                  {inquiry.quotedBy && (
                    <InfoRow
                      icon={User}
                      label="Quoted By"
                      value={inquiry.quotedBy.name}
                    />
                  )}
                  {inquiry.quotedAt && (
                    <InfoRow
                      icon={Calendar}
                      label="Quote Date"
                      value={formatDate(inquiry.quotedAt)}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Reference Source:
                  </span>
                  <Badge variant="outline">{inquiry.referenceSource}</Badge>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Remarks:
                  </span>
                  <p className="text-sm text-gray-900 mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-line">
                    {inquiry.remarks || "No remarks provided."}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Created on {formatDate(inquiry.createdAt)}
                </div>

                {inquiry.assignedTo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    Assigned to {inquiry.assignedTo.name}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connected Lead */}
            {inquiry.relatedLead && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                    Connected Lead
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={Tag}
                    label="Lead ID"
                    value={inquiry.relatedLead.id}
                  />
                  <InfoRow
                    icon={Flag}
                    label="Status"
                    value={<Badge>{inquiry.relatedLead.status}</Badge>}
                  />
                  <InfoRow
                    icon={User}
                    label="Contact Person"
                    value={inquiry.relatedLead.contactPerson || "N/A"}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={inquiry.relatedLead.email || "N/A"}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={inquiry.relatedLead.phone || "N/A"}
                  />
                  {inquiry.relatedLead.company && (
                    <InfoRow
                      icon={Building}
                      label="Company"
                      value={inquiry.relatedLead.company.name}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
