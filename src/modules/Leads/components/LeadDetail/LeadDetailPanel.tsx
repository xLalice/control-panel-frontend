import { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui";
import { LeadStatus } from "../../constants/constants";
import { User } from "@/types";
import {
  Pencil,
  Trash2,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  Tag,
  MessageSquare,
  DollarSign,
  X,
  BarChart,
} from "lucide-react";
import LeadForm from "../LeadForm/LeadForm";
import LeadDetailSkeleton from "../skeletons/LeadDetailSkeleton";
import { useLeadDetails } from "./hooks/useLeadDetails";
import { LeadActivities } from "./components/LeadActivities";
import { useAssignLead, useDeleteLead, useUpdateLeadStatus } from "./hooks/useLeadDetailMutations";

interface LeadDetailPanelProps {
  leadId: string | null;
  onClose: () => void;
  isOpen: boolean;
  users: User[];
}

const LeadDetailPanel = ({
  leadId,
  onClose,
  isOpen,
  users,
}: LeadDetailPanelProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: lead,
    isLoading: isLeadLoading,
    error: leadError,
  } = useLeadDetails({ leadId });

  const deleteLeadMutation = useDeleteLead();
  const updateStatusMutation = useUpdateLeadStatus();
 const updateAssignmentMutation = useAssignLead();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    updateStatusMutation.mutate({
      leadId: lead.id,
      oldStatus: lead.status,
      newStatus: newStatus,
      leadName: lead.name,
    });
  };

  const handleAssignmentChange = (userId: string) => {
    updateAssignmentMutation.mutate({
      leadId: lead.id,
      assignedToId: userId,
    });
  };

  const handleDeleteLead = () => {
    deleteLeadMutation.mutate({ leadId: lead.id });
  };

  return (
    <div className="">
      <div
        className="fixed inset-0 bg-black/20 z-20 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
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
              <LeadActivities leadId={lead.id} />
            </TabsContent>
          </Tabs>

          <LeadForm
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            lead={lead}
            users={users}
          />

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
