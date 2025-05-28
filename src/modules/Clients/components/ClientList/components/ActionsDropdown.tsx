import { Client } from "@/modules/Clients/clients.schema";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export const ActionsDropdown = ({ client }: { client: Client }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleView = () => {
    console.log("View client:", client.id);
    setIsOpen(false);
  };
  const handleEdit = () => {
    console.log("Edit client:", client.id);
    setIsOpen(false);
  };
  const handleDelete = () => {
    console.log("Delete client:", client.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!open)}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute">
            <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
              Actions
            </div>
            <button
              onClick={handleView}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Client
            </button>
          </div>
        </>
      )}
    </div>
  );
};
