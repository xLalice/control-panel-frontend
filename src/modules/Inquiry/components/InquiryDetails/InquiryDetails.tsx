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
  ExternalLink,
  FileText,
  Tag,
  ChevronRight,
  LucideProps,
  ArrowRight,
  Zap,
  ChevronDown,
  ChevronUp,
  Hash,
  ShoppingCart,
} from "lucide-react";
import { Inquiry, InquiryStatus, Priority } from "../../types";
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
import { User } from "@/types/sharedTypes";
import { SlideInPanel } from "@/components/SlideInPanel/SlideInPanel";

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

// Component for displaying individual items
const ItemCard = ({ item, index }: { item: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Item {index + 1}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              Qty: {item.quantity}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {item.product?.name && (
              <span className="text-sm font-medium text-gray-900 truncate max-w-48">
                {item.product.name}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 bg-white">
          <div className="pt-3 space-y-3">
            {item.product && (
              <InfoRow
                icon={Package}
                label="Product"
                value={
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    {item.product.category && (
                      <div className="text-xs text-gray-500 mt-1">
                        Category: {item.product.category}
                      </div>
                    )}
                    {item.product.sku && (
                      <div className="text-xs text-gray-500">
                        SKU: {item.product.sku}
                      </div>
                    )}
                  </div>
                }
              />
            )}

            <InfoRow icon={Tag} label="Quantity" value={item.quantity} />

            {item.remarks && (
              <InfoRow
                icon={FileText}
                label="Item Notes"
                value={
                  <div className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                    {item.remarks}
                  </div>
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for displaying multiple items summary
const ItemsSummary = ({ items }: { items: any[] }) => {
  const totalQuantity =
    items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const uniqueProducts = items?.length || 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Order Summary</h4>
            <p className="text-sm text-gray-600">
              {uniqueProducts} {uniqueProducts === 1 ? "item" : "items"} • Total
              qty: {totalQuantity}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {uniqueProducts}
          </div>
          <div className="text-xs text-gray-500">Products</div>
        </div>
      </div>
    </div>
  );
};

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
    if (inquiry.leadOriginated) {
      navigate(`/leads/`, {
        state: { leadIdToOpen: inquiry.leadOriginated.id },
      });
    }
  };

  return (
    <>
      <SlideInPanel isOpen={isOpen} onClose={onClose}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  Inquiry #{inquiry.id}
                </h2>
                <InquiryStatusBadge status={inquiry.status as InquiryStatus} />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {inquiry.clientName} • {formatDate(inquiry.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 px-0">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {inquiry.leadOriginated && inquiry.leadOriginated.id ? ( // Ensure leadOriginated.id exists
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleViewLead}
                  className="group flex items-center justify-center gap-3 px-6 py-4
          bg-gradient-to-r from-slate-50 to-blue-50
          border-2 border-slate-200 hover:border-blue-300
          text-slate-700 hover:text-blue-700
          transition-all duration-300 ease-out
          hover:shadow-lg hover:shadow-blue-100/50
          hover:-translate-y-0.5
          rounded-xl font-medium text-sm
          min-h-[56px] relative overflow-hidden"
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
                inquiry.status !== InquiryStatus.Closed &&
                !inquiry.leadId &&
                !inquiry.clientId && (
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
                )
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

            {/* Order Request - Enhanced for Multiple Items */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Order Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={HelpCircle}
                  label="Inquiry Type"
                  value={inquiry.inquiryType}
                />
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
                <Separator className="my-4" />
                <div className="space-y-4">
                  <ItemsSummary items={inquiry.items} />
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Requested Items
                    </h4>
                    <div className="space-y-2">
                      {inquiry.items.map((item: any, index: number) => (
                        <ItemCard key={index} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
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
            {inquiry.leadOriginated && (
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
                    value={inquiry.leadOriginated.id}
                  />
                  <InfoRow
                    icon={Flag}
                    label="Status"
                    value={<Badge>{inquiry.leadOriginated.status}</Badge>}
                  />
                  <InfoRow
                    icon={UserIcon}
                    label="Contact Person"
                    value={inquiry.leadOriginated.contactPerson || "N/A"}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={inquiry.leadOriginated.email || "N/A"}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={inquiry.leadOriginated.phone || "N/A"}
                  />
                  {inquiry.leadOriginated.company && (
                    <InfoRow
                      icon={Building}
                      label="Company"
                      value={inquiry.leadOriginated.company.name}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SlideInPanel>
    </>
  );
};
