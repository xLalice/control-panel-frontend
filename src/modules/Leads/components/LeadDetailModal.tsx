import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/api/api";
import { LeadStatus } from "../constants/constants";
import { User } from "@/types";
import { ActivityLog } from "../types/leads.types";
import {
  Pencil,
  Trash2,
  Clock,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  Tag,
  MapPin,
  Briefcase,
  MessageSquare,
  DollarSign,
  X,
  BarChart,
} from "lucide-react";
import { format } from "date-fns";
import LeadForm from "./LeadForm";
import LeadDetailSkeleton from "./skeletons/LeadDetailSkeleton";
import { toast } from "react-toastify";

interface LeadDetailPanelProps {
  leadId: string | null;
  onClose: () => void;
  isOpen: boolean;
  users: User[]
}

const LeadDetailPanel = ({ leadId, onClose, isOpen, users }: LeadDetailPanelProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const {
    data: lead,
    isLoading: isLeadLoading,
    error: leadError,
  } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId) return null;
      const response = await apiClient.get(`/leads/${leadId}`);
      return response.data;
    },
    enabled: !!leadId,
  });

  const { data: activities = [], isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["lead-activities", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const response = await apiClient.get(`/leads/${leadId}/activities`);
      return response.data;
    },
    enabled: !!leadId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!leadId) return null;
      const response = await apiClient.patch(`/leads/${leadId}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Failed to update lead status. Please try again.");
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!leadId) return null;
      const response = await apiClient.post(`/leads/${leadId}/assign`, {
        assignedToId: userId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead assigned successfully");
    },
    onError: (error) => {
      console.error("Error assigning lead:", error);
      toast.error("Failed to assign lead. Please try again.");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async () => {
      if (!leadId) throw new Error("No lead ID provided");
      const response = await apiClient.delete(`/leads/${leadId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setIsDeleteDialogOpen(false);
      onClose();
      toast.success("Lead deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again.");
      setIsDeleteDialogOpen(false);
    },
  });

  if (!isOpen) return null;

  if (isLeadLoading) {
    return (
      <div
        className="fixed inset-y-20 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-xl z-30 
                   transform transition-transform duration-300 ease-in-out
                   overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <LeadDetailSkeleton onClose={onClose} />
        </div>
      </div>
    );
  }

  if (leadError) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white shadow-xl z-30 p-6 overflow-y-auto">
        <div className="text-red-500">
          Error loading lead details. Please try again.
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white shadow-xl z-30 p-6 overflow-y-auto">
        <div>Lead not found.</div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  const handleAssignmentChange = (userId: string) => {
    updateAssignmentMutation.mutate(userId);
  };

  const handleDeleteLead = () => {
    deleteLeadMutation.mutate();
  };

  const formatDateTime = (date: Date) => {
    try {
      return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return date.toString();
    }
  };
  const ActivityTimelineSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={`activity-${i}`} className="flex">
          <div className="mr-4 flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-24 w-px bg-gray-200"></div>
          </div>
          <div className="pb-8 w-full">
            <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-md w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-40 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="">
      <div
        className="fixed inset-0 bg-black/20 z-20 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        className={`fixed inset-y-20 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-xl z-30 
                   transform transition-transform duration-300 ease-in-out 
                   ${isOpen ? "translate-x-0" : "translate-x-full"} 
                   overflow-y-auto`}
        aria-label="Lead details"
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {lead.contactPerson} {lead.company && `- ${lead.company.name}`}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Details</CardTitle>
                  <CardDescription>
                    Comprehensive information about this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <UserIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Contact Person
                          </p>
                          <p>{lead.contactPerson}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Email
                          </p>
                          <p>{lead.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Phone
                          </p>
                          <p>{lead.phone || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Company
                          </p>
                          <p>{lead.company ? lead.company.name : "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Industry
                          </p>
                          <p>{lead.industry || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <BarChart className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Lead Score
                          </p>
                          <p>{lead.leadScore || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Status
                          </p>
                          <Select
                            defaultValue={lead.status}
                            onValueChange={handleStatusChange}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(LeadStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <UserIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Assigned To
                          </p>
                          <Select
                            value={lead.assignedToId ?? "unassigned"}
                            onValueChange={(value) =>
                              handleAssignmentChange(
                                value === "unassigned" ? "unassigned" : value
                              )
                            }
                            disabled={updateAssignmentMutation.isPending}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">
                                Unassigned
                              </SelectItem>
                              {users.map((user: User) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Estimated Value
                          </p>
                          <p>
                            {lead.estimatedValue
                              ? `$${lead.estimatedValue.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Region
                          </p>
                          <p>{lead.region || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Source
                          </p>
                          <p>{lead.source || "N/A"}</p>
                        </div>
                      </div>

                      
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="whitespace-pre-wrap">
                        {lead.notes || "No notes available."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>
                    A chronological history of activities for this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isActivitiesLoading ? (
                    <ActivityTimelineSkeleton />
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity: ActivityLog) => (
                        <div key={activity.id} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="h-full w-px bg-gray-200"></div>
                          </div>
                          <div className="pb-8">
                            <p className="text-sm text-gray-500">
                              {formatDateTime(activity.createdAt)}
                            </p>
                            <h4 className="font-medium">{activity.action}</h4>
                            <p className="text-gray-600">
                              {activity.description}
                            </p>
                            {activity.createdBy && (
                              <p className="text-sm text-gray-400">
                                By {activity.createdBy.name}
                              </p>
                            )}
                            {activity.oldStatus && activity.newStatus && (
                              <p className="text-sm text-gray-500">
                                Status changed from{" "}
                                <span className="font-medium">
                                  {activity.oldStatus}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                  {activity.newStatus}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      No activities recorded for this lead.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {isEditDialogOpen && (
            <LeadForm
              lead={lead}
              onClose={() => setIsEditDialogOpen(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
                queryClient.invalidateQueries({ queryKey: ["leads"] });
                setIsEditDialogOpen(false);
              }}
              users={users}
            />
          )}

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteLeadMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteLead}
                  disabled={deleteLeadMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {deleteLeadMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </div>
  );
};

export default LeadDetailPanel;
