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
  User as UserIcon,
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
  ArrowRight,
  Zap,
} from "lucide-react";
import { Inquiry, Priority } from "../../types";
import { useNavigate } from "react-router-dom";
import { getPriorityColor } from "../../inquiry.utils";
import { Select, SelectItem } from "@/components/ui";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { useUsersData } from "@/modules/UserManagement/hooks/useUsersData";
import { useAssignInquiryMutation } from "../hooks/useAssignInquiryMutation";
import { useEffect, useState } from "react";
import { InquiryStatusBadge } from "../InquiryStatusBadge";
import { formatDate } from "../../inquiry.utils";
import { User } from "@/types";

interface InquiryDetailProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry;
  onConvertToLead: () => void;
}

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
  const [currentAssignment, setCurrentAssignment] = useState<User | null>(
    inquiry.assignedTo ?? null
  );

  useEffect(() => {
    setCurrentAssignment(inquiry.assignedTo ?? null);
  }, [inquiry.assignedTo]);

  const navigate = useNavigate();

  const { data: users } = useUsersData();

  const { mutate: assignInquiry, isPending: isAssigning } =
    useAssignInquiryMutation(inquiry.id);

  const handleAssignmentChange = (selectedUserId: string) => {
    if (selectedUserId === "unassign") {
      setCurrentAssignment(null);
      assignInquiry({ assignedToId: null });
    } else {
      const selectedUser = users?.find((user) => user.id === selectedUserId);
      if (selectedUser) {
        setCurrentAssignment(selectedUser);
      }
      assignInquiry({ assignedToId: selectedUserId });
    }
  };

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
          <div className="mt-6 px-0">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {inquiry.relatedLeadId ? (
                <Button
                  variant="outline"
                  size="default"
                  className="group flex items-center justify-center gap-3 px-6 py-4 
                   bg-gradient-to-r from-slate-50 to-blue-50 
                   border-2 border-slate-200 hover:border-blue-300
                   text-slate-700 hover:text-blue-700
                   transition-all duration-300 ease-out
                   hover:shadow-lg hover:shadow-blue-100/50
                   hover:-translate-y-0.5
                   rounded-xl font-medium text-sm
                   min-h-[56px] relative overflow-hidden"
                  onClick={handleViewLead}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 
                        group-hover:from-blue-500/5 group-hover:to-indigo-500/5 
                        transition-all duration-300"
                  />

                  <div className="relative flex items-center gap-3">
                    <div
                      className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 
                          transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold">View Connected Lead</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Button>
              ) : (
                <Button
                  onClick={onConvertToLead}
                  size="default"
                  className="group flex items-center justify-center gap-3 px-6 py-4
                   bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
                   hover:from-emerald-600 hover:via-green-600 hover:to-teal-600
                   text-white font-semibold text-sm
                   shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30
                   transition-all duration-300 ease-out
                   hover:-translate-y-0.5 hover:scale-[1.02]
                   rounded-xl border-0 min-h-[56px]
                   relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%] 
                        transition-transform duration-700 ease-out"
                  />

                  <div className="relative flex items-center gap-3">
                    <div
                      className="p-1.5 rounded-lg bg-white/20 group-hover:bg-white/30 
                          transition-colors duration-200"
                    >
                      <Zap className="h-4 w-4" />
                    </div>
                    <span>Convert to Lead</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Button>
              )}

              <div
                className="flex items-center gap-3 bg-white rounded-xl p-4 
                              border-2 border-gray-200 hover:border-gray-300
                              shadow-sm hover:shadow-md
                              transition-all duration-200
                              min-h-[56px] flex-1 sm:flex-initial sm:min-w-[280px]"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="p-1.5 rounded-lg bg-purple-100">
                    <UserIcon className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <span className="whitespace-nowrap">Assign to:</span>
                </div>

                <Select
                  value={currentAssignment?.id || "unassign"}
                  onValueChange={handleAssignmentChange}
                  disabled={isAssigning}
                >
                  <SelectTrigger
                    className="h-10 flex-1 border-2 border-gray-200 
                                            focus:border-purple-400 focus:ring-2 focus:ring-purple-100
                                            hover:border-gray-300 
                                            rounded-lg bg-gray-50 hover:bg-white
                                            transition-all duration-200
                                            text-sm font-medium
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SelectValue
                      placeholder={
                        <span className="text-gray-500">
                          {currentAssignment?.name || "Select assignee..."}
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-200 shadow-lg bg-white">
                    <SelectItem
                      value="unassign"
                      className="hover:bg-gray-50 focus:bg-gray-50 rounded-lg m-1 
                                 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-gray-600">Unassigned</span>
                      </div>
                    </SelectItem>
                    {users?.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className="hover:bg-purple-50 focus:bg-purple-50 rounded-lg m-1
                                   transition-colors duration-150 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Loading indicator for assignment */}
                {isAssigning && (
                  <div className="flex items-center justify-center w-6 h-6">
                    <div
                      className="w-4 h-4 border-2 border-purple-500 border-t-transparent 
                                    rounded-full animate-spin"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto pb-20">
          <div className="p-6 space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={UserIcon}
                  label="Name"
                  value={inquiry.clientName}
                />
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
                      icon={UserIcon}
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
                    <UserIcon className="h-4 w-4" />
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
                    icon={UserIcon}
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
