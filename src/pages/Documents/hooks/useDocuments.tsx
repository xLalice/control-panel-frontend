import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument
} from "@/api/api";
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(
        `Failed to create category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; description?: string };
    }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(
        `Failed to update category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        errorMessage.includes("Cannot delete category with existing documents")
      ) {
        toast.error("Cannot delete category that contains documents");
      } else {
        toast.error(`Failed to delete category: ${errorMessage}`);
      }
    },
  });
};

// Document hooks
export const useDocuments = (categoryId?: number) => {
  return useQuery({
    queryKey: ["documents", { categoryId }],
    queryFn: () => getDocuments(categoryId),
  });
};

export const useDocument = (id: number) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(id),
    enabled: id > 0,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(`Document "${data.title}" uploaded successfully`);
    },
    onError: (error) => {
      toast.error(
        `Failed to upload document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Failed to delete document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};
