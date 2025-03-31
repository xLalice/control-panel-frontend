import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentCategoryList } from "./DocumentCategoryList";
import { DocumentList } from "./DocumentList";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentPreview } from "./DocumentPreview";
import { useCategories } from "../hooks/useDocuments";
import { usePermissions } from "@/hooks/usePermission";
import { Loader } from "@/components/ui/Loader";

export const DocumentLayout: React.FC = () => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { hasPermission, isLoading: isLoadingPermissions } = usePermissions();

  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | undefined
  >(undefined);
  const [previewDocumentId, setPreviewDocumentId] = React.useState<
    number | undefined
  >(undefined);

  if (isLoadingPermissions || isLoadingCategories) {
    return Loader(true);
  }

  const visibleTabs = [
    {
      value: "browse",
      label: "Browse Documents",
      allowed: hasPermission("READ_DOCUMENTS"),
    },
    {
      value: "upload",
      label: "Upload Document",
      allowed: hasPermission("WRITE_DOCUMENTS"),
    },
    {
      value: "categories",
      label: "Manage Categories",
      allowed: hasPermission("MANAGE_DOCUMENT_CATEGORIES"),
    },
  ].filter((tab) => tab.allowed);

  const defaultTab = visibleTabs[0]?.value || "browse";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Document Management</h1>

      {visibleTabs.length > 0 ? (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-4">
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {hasPermission("READ_DOCUMENTS") && (
            <TabsContent value="browse" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <h2 className="text-lg font-medium mb-2">Categories</h2>
                  {isLoadingCategories ? (
                    <div className="border rounded-md p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4">
                      <ul className="space-y-2">
                        <li>
                          <button
                            className={`w-full text-left px-3 py-2 rounded-md ${
                              selectedCategoryId === undefined
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedCategoryId(undefined)}
                          >
                            All Documents
                          </button>
                        </li>
                        {categories?.map((category) => (
                          <li key={category.id}>
                            <button
                              className={`w-full text-left px-3 py-2 rounded-md ${
                                selectedCategoryId === category.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setSelectedCategoryId(category.id)}
                            >
                              {category.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="md:col-span-3">
                  <DocumentList
                    categoryId={selectedCategoryId}
                    onPreview={setPreviewDocumentId}
                  />
                </div>
              </div>
              {previewDocumentId && (
                <DocumentPreview
                  documentId={previewDocumentId}
                  onClose={() => setPreviewDocumentId(undefined)}
                />
              )}
            </TabsContent>
          )}

          {hasPermission("WRITE_DOCUMENTS") && (
            <TabsContent value="upload">
              <DocumentUpload />
            </TabsContent>
          )}

          {hasPermission("MANAGE_DOCUMENT_CATEGORIES") && (
            <TabsContent value="categories">
              <DocumentCategoryList />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="text-center text-muted-foreground">
          You do not have permission to access any document management features.
        </div>
      )}
    </div>
  );
};
