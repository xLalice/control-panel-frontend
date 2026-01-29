// types.ts
export interface DocumentCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: number;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedById: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category?: DocumentCategory;
}
