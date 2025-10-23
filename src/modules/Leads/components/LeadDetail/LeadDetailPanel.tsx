import { useState } from "react";
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
  BarChart,
  Zap,
  Briefcase,
  NotebookPen,
  FilePlus,
} from "lucide-react";
import LeadForm from "../LeadForm/LeadForm";
import LeadDetailSkeleton from "../skeletons/LeadDetailSkeleton";
import { useLeadDetails } from "./hooks/useLeadDetails";
import { ActivitiesTimeline } from "@/components/ActivitiesTImeline/ActivitiesTImeline";
import {
  useAssignLead,
  useDeleteLead,
  useUpdateLeadStatus,
} from "./hooks/useLeadDetailMutations";
import { useConvertToClientMutation } from "./hooks/useConvertToClientMutation";
import { useNavigate } from "react-router-dom";
import { SlideInPanel } from "@/components/SlideInPanel/SlideInPanel";
import { ContactHistoryTimeline } from "@/components/ActivitiesTImeline/ContactHistoryTImeline";
import { LogContactModal } from "@/components/LogContactModal";
import { CreateQuotationDialog } from "@/modules/Inquiry/components/CreateQuoteDialog";
import { useUsersData } from "@/modules/UserManagement/hooks/useUsersData";

interface LeadDetailPanelProps {
  leadId: string | null;
  onClose: () => void;
  isOpen: boolean;
}

const LeadDetailPanel = ({
  leadId,
  onClose,
  isOpen,
}: LeadDetailPanelProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogContactModalOpen, setIsLogContactModalOpen] = useState(false);
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: lead,
    isLoading: isLeadLoading,
    error: leadError,
  } = useLeadDetails({ leadId });
  const {data: users = []} = useUsersData();

  const deleteLeadMutation = useDeleteLead();
  const updateStatusMutation = useUpdateLeadStatus();
  const updateAssignmentMutation = useAssignLead();
  const { mutateAsync: convertToClientMutation, isPending } =
    useConvertToClientMutation();

  const handleStatusChange = (newStatus: string) => {
    if (!lead) return; 
    updateStatusMutation.mutate({
      leadId: lead.id,
      oldStatus: lead.status,
      newStatus: newStatus,
      leadName: lead.name,
    });
  };

  const handleAssignmentChange = (userId: string | null) => {
    if (!lead) return;
    updateAssignmentMutation.mutate({
      leadId: lead.id,
      assignedToId: userId === "unassigned" ? null : userId,
    });
  };

  const handleDeleteLead = () => {
    if (!lead) return;
    deleteLeadMutation.mutate(
      { leadId: lead.id },
      {
        onSuccess: () => {
          onClose();
          setIsDeleteDialogOpen(false);
        },
      }
    );
  };

  const handleConvertToCLient = async () => {
    if (!lead) return;
    if (lead.client?.id) {
      navigate("/clients", {
        state: { clientIdToOpen: lead.client.id },
      });
      onClose();
    } else if (lead.status === LeadStatus.Won) {
      try {
        const newClient = await convertToClientMutation({
          leadId: lead.id,
        });
        if (newClient.id) {
          navigate("/clients", {
            state: { clientIdToOpen: newClient.id },
          });
          onClose();
        }
      } catch (error) {
        console.error("Failed to convert lead to client:", error);
      }
    }
  };

  const panelTitle = lead
    ? `${lead.contactPerson} ${lead.company ? `- ${lead.company.name}` : ""}`
    : "Lead Details";

  const handleOpenLogContactModal = () => {
    setIsLogContactModalOpen(true);
  };

  const handleCloseLogContactModal = () => {
    setIsLogContactModalOpen(false);
  };

  return (
    <>
      <SlideInPanel
        isOpen={isOpen}
        onClose={onClose}
        title={panelTitle}
        isLoading={isLeadLoading}
        error={leadError}
        skeleton={LeadDetailSkeleton}
      >
        {!leadId || (leadError && !isLeadLoading) ? (
          <div className="text-muted-foreground text-center p-4">
            {leadId
              ? "Lead not found or an error occurred."
              : "Select a lead to view details."}
          </div>
        ) : lead ? (
          <>
            <div className="flex gap-2 mb-4">
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

              {lead.client?.id ? (
                <Button size="sm" onClick={handleConvertToCLient}>
                  <Briefcase className="h-4 w-4 mr-2" /> View Related Client
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleConvertToCLient}
                  disabled={isPending}
                  className={lead.status !== LeadStatus.Won ? "hidden" : ""}
                >
                  <Zap className="h-4 w-4 mr-2" />{" "}
                  {isPending ? "Converting..." : "Convert to Client"}
                </Button>
              )}
              {
                <Button
                  onClick={handleOpenLogContactModal}
                  size="sm"
                  className="bg-green-400 text-white hover:bg-green-600"
                >
                  <NotebookPen className="mr-2 h-4 w-4" />
                  Log Contact
                </Button>
              }

              {lead.status === "Qualified" && (
                <Button
                  size="sm"
                  onClick={() => setIsQuotationDialogOpen(true)}
                >
                  <FilePlus className="h-4 w-4 mr-2" /> Create Quotation
                </Button>
              )}
            </div>

            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                <TabsTrigger value="contact">Contact History</TabsTrigger>
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
                              onValueChange={handleAssignmentChange}
                              disabled={updateAssignmentMutation.isPending}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">
                                  Unassigned
                                </SelectItem>
                                {users.map((user) => (
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
                        <p className="text-sm font-medium text-gray-500">
                          Notes
                        </p>
                        <p className="whitespace-pre-wrap">
                          {lead.notes || "No notes available."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <ActivitiesTimeline entityId={lead.id} entityType="Lead" />
              </TabsContent>
              <TabsContent value="contact" className="space-y-4">
                <ContactHistoryTimeline entityId={lead.id} entityType="Lead" />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-muted-foreground text-center p-4">
            Error: Lead data could not be loaded.
          </div>
        )}

        {isEditDialogOpen && <LeadForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onOpenChange={setIsEditDialogOpen}
          lead={lead}
        />}

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this lead? This action cannot be
                undone.
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
      </SlideInPanel>
      {isLogContactModalOpen && (
        <LogContactModal
          isOpen={isLogContactModalOpen}
          onClose={handleCloseLogContactModal}
          entityId={lead?.id!}
          entityType="Lead"
        />
      )}

      {lead?.id && (
        <CreateQuotationDialog
          open={isQuotationDialogOpen}
          onClose={() => setIsQuotationDialogOpen(false)}
          entity={{ id: lead?.id, type: "lead" }}
        />
      )}
    </>
  );
};

export default LeadDetailPanel;
