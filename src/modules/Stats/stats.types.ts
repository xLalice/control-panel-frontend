import {
  Users,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  Target,
  Phone,
  Mail,
  Activity,
} from "lucide-react";

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  color: string;
}

export interface RevenueItem {
  month: string;
  revenue: number;
  leads: number;
  target: number;
}

export interface SalesPipelineItem {
  status: string;
  count: number;
  value: number;
}

export interface InquirySource {
  source: string;
  count: number;
  color: string;
}

export interface ProductPerformanceItem {
  category: string;
  inquiries: number;
  quotations: number;
  revenue: number;
}

export interface AttendanceItem {
  day: string;
  present: number;
  late: number;
  absent: number;
}

export interface RecentActivityItem {
  id: string | number;
  type: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
}

export interface DashboardData {
  metrics: Metric[];
  revenueData: RevenueItem[];
  salesPipeline: SalesPipelineItem[];
  inquirySources: InquirySource[];
  productPerformance: ProductPerformanceItem[];
  attendance: AttendanceItem[];
  recentActivity: RecentActivityItem[];
}


export const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  Target,
  Users,
  FileText,
  Calendar,
  Clock,
  Phone,
  Mail,
  Activity,
};