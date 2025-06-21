import axios from "axios";
import { LoginFormData } from "../modules/Login";
import { User } from "@/types/sharedTypes";
import { Product } from "@/modules/Products/types";
import {
  InquiryFilterParams,
  PaginatedResponse,
  Inquiry,
  UpdateInquiryDto,
  CreateInquiryDto,
  InquiryStatistics,
  ConversionResult,
} from "@/modules/Inquiry/types";
import { Document, DocumentCategory } from "@/modules/Documents/types";
import { Attendance, DTRSettings, AllowedIP } from "@/modules/Attendance/types";
import { Lead } from "@/modules/Leads/types/leads.types";

export interface QuoteDetails {
  basePrice: number;
  deliveryFee?: number;
  discount?: number;
  taxes?: number;
  totalPrice: number;
  validUntil?: Date;
  notes?: string;
}

const baseURL = `${import.meta.env.VITE_API_URL}/api/`;

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (data: LoginFormData): Promise<{ user: User }> => {
  const response = await apiClient.post<{ user: User }>("/auth/login", data);
  return response.data;
};

export const me = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};

// ----------------- API Functions -----------------

export const fetchUsers = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching users failed");
  }
};

export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: { id: number; name: string };
}) => {
  try {
    const response = await apiClient.post("/users", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Adding user failed");
  }
};

export const updateUser = async (
  id: string,
  userData: {
    name?: string;
    email?: string;
    role?: { id: number; name: string };
  }
) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating user failed");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting user failed");
  }
};

export const getPermissions = async () => {
  try {
    const response = await apiClient.get(`/users/permissions`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Getting permissions failed"
    );
  }
};

export const fetchLead = async (sheetName: string, queryParams: string) => {
  try {
    const response = await apiClient.get(
      `/sales/leads/${sheetName}?${queryParams}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching leads failed");
  }
};

export const fetchSheetNames = async () => {
  try {
    const response = await apiClient.get(`/sales/sheets`);
    return response.data.sheetNames;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Fetching sheet names failed"
    );
  }
};

export const updateLead = async (
  sheetName: string,
  leadId: string,
  updates: Partial<Lead>
): Promise<void> => {
  try {
    const encodedSheetName = encodeURIComponent(sheetName);
    const response = await apiClient.patch(
      `/sales/leads/${encodedSheetName}/${leadId}`,
      updates
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating lead failed");
  }
};

// Reports
export const fetchReports = async () => {
  try {
    const response = await apiClient.get("/reports");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching reports failed");
  }
};

export const createReport = async (reportData: any) => {
  try {
    const response = await apiClient.post("/reports", reportData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Creating report failed");
  }
};

export const updateReport = async (id: string, reportData: any) => {
  try {
    const response = await apiClient.put(`/reports/${id}`, reportData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating report failed");
  }
};

export const deleteReport = async (id: string) => {
  try {
    await apiClient.delete(`/reports/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting report failed");
  }
};

// Products
export const fetchProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Fetching products failed");
  }
};

export const addProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  try {
    const response = await apiClient.post("/products", product);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Creating product failed");
  }
};

export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await apiClient.put(`/products/${product.id}`, product);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Updating product failed");
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Deleting product failed");
  }
};

export const getInquiries = async (
  params: InquiryFilterParams
): Promise<PaginatedResponse<Inquiry>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.source) queryParams.append("source", params.source);
    if (params.productType)
      queryParams.append("productType", params.productType);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);
    if (params.startDate)
      queryParams.append("startDate", params.startDate.toString());
    if (params.endDate)
      queryParams.append("endDate", params.endDate.toString());

    const response = await apiClient.get(
      `/inquiries?${queryParams.toString()}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fetching inquiries failed");
  }
};

// Get a single inquiry by ID
export const getInquiryById = async (id: string): Promise<Inquiry> => {
  try {
    const response = await apiClient.get(`/inquiries/${id}`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fetching inquiry failed");
  }
};

export interface InquiryContactResponse {
  exists: boolean;
  lead?: {
    id: string;
    companyId: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    status: string;
    company?: {
      id: string;
      name: string;
    };
    contactHistory?: {
      id: string;
      method: string;
      summary: string;
      outcome?: string;
      timestamp: Date;
    }[];
  };
  company?: {
    id: string;
    name: string;
  };
}

// Check if customer exists
export const checkCustomerExists = async (params: {
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  clientName?: string;
}): Promise<InquiryContactResponse> => {
  try {
    const response = await apiClient.post("/inquiries/check-customer", params);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(
      err.response?.data?.error || "Checking customer existence failed"
    );
  }
};

// Create a new inquiry
export const createInquiry = async (
  inquiry: CreateInquiryDto
): Promise<Inquiry> => {
  try {
    const response = await apiClient.post("/inquiries", inquiry);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Creating inquiry failed");
  }
};

// Update an existing inquiry
export const updateInquiry = async (
  id: string,
  inquiry: UpdateInquiryDto
): Promise<Inquiry> => {
  try {
    const response = await apiClient.put(`/inquiries/${id}`, inquiry);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Updating inquiry failed");
  }
};

// Create a quote for an inquiry
export const createQuote = async (
  id: string,
  quoteDetails: QuoteDetails
): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(
      `/inquiries/${id}/quote`,
      quoteDetails
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Creating quote failed");
  }
};

// Approve an inquiry
export const approveInquiry = async (id: string): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/approve`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Approving inquiry failed");
  }
};

// Schedule an inquiry
export const scheduleInquiry = async (
  id: string,
  scheduledDate: Date | string,
  options?: {
    priority?: string;
    reminderMinutes?: number;
  }
): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/schedule`, {
      scheduledDate,
      ...(options && {
        priority: options.priority,
        reminderMinutes: options.reminderMinutes,
      }),
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Scheduling inquiry failed");
  }
};

// Fulfill an inquiry
export const fulfillInquiry = async (id: string): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/fulfill`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fulfilling inquiry failed");
  }
};

// Delete an inquiry
export const deleteInquiry = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/inquiries/${id}`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Deleting inquiry failed");
  }
};

// Get inquiry statistics
export const getInquiryStatistics = async (
  startDate?: string | Date,
  endDate?: string | Date
): Promise<InquiryStatistics> => {
  try {
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("startDate", startDate.toString());
    if (endDate) queryParams.append("endDate", endDate.toString());

    const response = await apiClient.get(
      `/inquiries/stats/overview?${queryParams.toString()}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(
      err.response?.data?.error || "Fetching inquiry statistics failed"
    );
  }
};

// Convert inquiry to lead
export const convertInquiryToLead = async (
  id: string
): Promise<ConversionResult> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/convert-to-lead`);
    return response.data.data;
  } catch (err: any) {
    console.error("Original error caught in api.ts:", err);
    console.error("Error response data in api.ts:", err.response?.data);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Converting inquiry to lead failed";

    throw new Error(errorMessage);
  }
};

export const reviewInquiry = async (id: string): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/review`);
    return response.data;
  } catch (err: any) {
    console.error("Original error caught in api.ts:", err);
    console.error("Error response data in api.ts:", err.response?.data);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Converting inquiry to lead failed";

    throw new Error(errorMessage);
  }
};

export const closeInquiry = async (id: string): Promise<Inquiry> => {
  try {
    const response = await apiClient.post(`/inquiries/${id}/close`);
    return response.data;
  } catch (err: any) {
    console.error("Original error caught in api.ts:", err);
    console.error("Error response data in api.ts:", err.response?.data);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Converting inquiry to lead failed";

    throw new Error(errorMessage);
  }
};


export const getCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const response = await apiClient.get(`/documents/categories`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fetching categories failed");
  }
};

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<DocumentCategory> => {
  try {
    const response = await apiClient.post(`/documents/categories`, data);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Creating category failed");
  }
};

export const updateCategory = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<DocumentCategory> => {
  try {
    const response = await apiClient.put(`/documents/categories/${id}`, data);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Updating category failed");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/documents/categories/${id}`);
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Deleting category failed");
  }
};

// Documents API
export const getDocuments = async (
  categoryId?: number
): Promise<Document[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (categoryId) queryParams.append("categoryId", categoryId.toString());

    const response = await apiClient.get(
      `/documents?${queryParams.toString()}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fetching documents failed");
  }
};

export const getDocumentById = async (id: number): Promise<Document> => {
  try {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Fetching document failed");
  }
};

export const uploadDocument = async (formData: FormData): Promise<Document> => {
  try {
    const response = await apiClient.post(`/documents/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Uploading document failed");
  }
};

export const deleteDocument = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/documents/${id}`);
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.error || "Deleting document failed");
  }
};

// Helper function to get download URL
export const getDocumentDownloadUrl = (id: number): string => {
  return `/api/documents/${id}/download`;
};

export const previewDocument = async (id: number) => {
  try {
    // Use arraybuffer responseType to handle binary data properly
    const response = await apiClient.get(`/documents/${id}/preview`, {
      responseType: "arraybuffer",
    });

    // Get mime type from Content-Type header
    const mimeType =
      response.headers["content-type"]?.split(";")[0] ||
      "application/octet-stream";

    // Extract filename from Content-Disposition if available
    let filename = "document";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="([^"]+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    console.log("Response received:", {
      mimeType,
      filename,
      dataSize: response.data.byteLength,
    });

    // Return properly structured object
    return {
      mimeType,
      filename,
      buffer: response.data, // This is already an ArrayBuffer
    };
  } catch (err: any) {
    console.error("Preview document error:", err);

    // If the error response is in arraybuffer format, we need to parse it
    if (
      err.response?.data instanceof ArrayBuffer &&
      err.response.data.byteLength > 0
    ) {
      try {
        const decoder = new TextDecoder("utf-8");
        const jsonStr = decoder.decode(err.response.data);
        const errorData = JSON.parse(jsonStr);
        throw new Error(
          errorData.error || errorData.message || "Previewing document failed"
        );
      } catch (parseErr) {
        // If we can't parse the error, fall back to generic message
        throw new Error("Previewing document failed");
      }
    } else {
      throw new Error(
        err.response?.data?.error || "Previewing document failed"
      );
    }
  }
};

// Attendance
export const clockIn = async () => {
  const response = await apiClient.post("/attendance/clock-in");
  return response.data;
};

export const clockOut = async () => {
  const response = await apiClient.post("/attendance/clock-out");
  return response.data;
};

export const startBreak = async (reason?: string) => {
  const response = await apiClient.post("/attendance/break/start", { reason });
  return response.data;
};

export const endBreak = async () => {
  const response = await apiClient.post("/attendance/break/end");
  return response.data;
};

export const getUserAttendance = async (params?: {
  startDate?: string;
  endDate?: string;
  userId?: string;
}) => {
  const url = params?.userId
    ? `/attendance/user/${params.userId}`
    : "/attendance/my-attendance";
  const response = await apiClient.get(url, {
    params: { startDate: params?.startDate, endDate: params?.endDate },
  });
  return response.data as Attendance[];
};

// Admin endpoints
export const getAllAttendance = async (params?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) => {
  const response = await apiClient.get("/attendance/all", { params });
  return response.data as Attendance[];
};

export const updateSettings = async (settings: Partial<DTRSettings>) => {
  const response = await apiClient.put("/attendance/settings", settings);
  return response.data;
};

export const getSettings = async () => {
  const response = await apiClient.get("/attendance/settings");
  return response.data as DTRSettings;
};

export const manageAllowedIPs = async (payload: {
  action: "add" | "remove" | "update";
  ipAddress: string;
  userId: string;
  description?: string;
  id?: string;
}) => {
  const response = await apiClient.post("/attendance/allowed-ips", payload);
  return response.data;
};

export const getAllowedIPs = async (userId?: string) => {
  const response = await apiClient.get("/attendance/allowed-ips", {
    params: { userId },
  });
  return response.data as AllowedIP[];
};
