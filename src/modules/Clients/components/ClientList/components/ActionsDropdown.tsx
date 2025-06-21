import { apiClient } from "@/api/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@/modules/Clients/clients.schema";
import { FormMode } from "../../ClientForm/client.schema";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, AlertTriangle, History } from "lucide-react";
import {toast} from "react-toastify";
import { InteractionHistoryDialog } from "../../ClientHistory/ClientHistory";

export const ActionsDropdown = ({
  client,
  setFormIsOpen,
  setFormMode,
  setSelectedClient,
  refetch,
}: {
  client: Client;
  setFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormMode: React.Dispatch<React.SetStateAction<FormMode>>;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  refetch: any;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);


  const handleEdit = () => {
    setSelectedClient(client);
    setFormMode("edit");
    setFormIsOpen(true);
    setDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDropdownOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/clients/${client.id}`);
      setDeleteDialogOpen(false);
      refetch();
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={`Actions for ${client.clientName || 'client'}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 z-50"
          sideOffset={4}
        >
          <DropdownMenuItem 
            onClick={() => setHistoryDialogOpen(true)}
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <History className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>View History</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleEdit} 
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Edit Client</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Client</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-left">Delete Client</DialogTitle>
                <DialogDescription className="text-left">
                  Are you sure you want to delete this client? This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {client.clientName && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium text-foreground">
                Client: {client.clientName}
              </p>
              {client.primaryEmail && (
                <p className="text-sm text-muted-foreground">
                  {client.primaryEmail}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Client
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {historyDialogOpen && <InteractionHistoryDialog
        clientId={client.id}
        clientName={client.clientName}
        isOpen={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
      />}
    </>
  );
};