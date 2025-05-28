import React from "react";
import { useDocuments, useDeleteDocument } from "../hooks/useDocuments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  TrashIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { getDocumentDownloadUrl } from "@/api/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatFileSize, formatDate } from "../utils/utils";
import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";

interface DocumentListProps {
  categoryId?: number;
  onPreview: (documentId: number) => void;
}

export const DocumentListSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-32 mb-1" />
        <Skeleton className="h-5 w-64" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-10" />
                </TableHead>
                <TableHead className="w-1/4">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="w-1/4">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="w-16">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="w-32">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="w-16 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const DocumentList: React.FC<DocumentListProps> = ({
  categoryId,
  onPreview,
}) => {
  const { data: documents, isLoading, error } = useDocuments(categoryId);
  const deleteDocument = useDeleteDocument();

  const canRead = useAppSelector((state) =>
    selectUserHasPermission(state, "read:documents")
  );
  const canUpload = useAppSelector((state) =>
    selectUserHasPermission(state, "upload:documents")
  );
  const canManage = useAppSelector((state) =>
    selectUserHasPermission(state, "manage:documents")
  );

  const handleDelete = (id: number) => {
    deleteDocument.mutate(id);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image"))
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (fileType.includes("pdf"))
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />;
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return <PresentationIcon className="h-5 w-5 text-orange-500" />;
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };

  if (!canRead) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <FileIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-gray-500">
            You don't have permission to view documents.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) return <DocumentListSkeleton />;
  if (error) return <p>Error loading documents: {String(error)}</p>;
  if (!documents || documents.length === 0)
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <FileIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-gray-500">
            {categoryId
              ? "There are no documents in this category."
              : "Upload some documents to get started."}
          </p>
        </div>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          {categoryId
            ? `Viewing documents in the selected category`
            : "Viewing all accessible documents"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Type</TableHead>
                <TableHead className="w-1/4">Title</TableHead>
                <TableHead className="w-1/4">File Name</TableHead>
                <TableHead className="w-16">Size</TableHead>
                <TableHead className="w-32">Uploaded</TableHead>
                {(canManage || canUpload || canRead) && (
                  <TableHead className="w-16 text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id} className="hover:bg-gray-50">
                  <TableCell>{getFileIcon(document.fileType)}</TableCell>
                  <TableCell
                    className="font-medium truncate max-w-xs"
                    title={document.title}
                  >
                    {document.title}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-xs"
                    title={document.filename}
                  >
                    {document.filename}
                  </TableCell>
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  <TableCell>{formatDate(document.createdAt)}</TableCell>
                  {(canManage || canUpload || canRead) && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canRead && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onPreview(document.id)}
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={getDocumentDownloadUrl(document.id)}
                                  download={document.filename}
                                  className="w-full flex items-center cursor-pointer"
                                >
                                  <DownloadIcon className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </DropdownMenuItem>
                            </>
                          )}
                          {canManage && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the document "
                                    {document.title}". This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(document.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
