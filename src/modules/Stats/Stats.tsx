import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  Target,
  Phone,
  Mail,
} from "lucide-react";
import { apiClient } from "@/api/api";

interface DashboardProps {}

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  color: string;
}


interface SalesPipelineItem {
  status: string;
  count: number;
  value: number;
}

interface InquirySource {
  source: string;
  count: number;
  color: string;
}

interface ProductPerformanceItem {
  category: string;
  inquiries: number;
  quotations: number;
  revenue: number | { s: number; e: number; d: number[] };
}


interface RecentActivityItem {
  id: string;
  type: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
}


const iconMap = {
  DollarSign,
  Target,
  Users,
  FileText,
  Calendar,
  Clock,
  Phone,
  Mail,
};

const Stats: React.FC<DashboardProps> = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", timeRange],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });

  // Loading state
  if (isLoading && !dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state (will still show mock data due to fallbackData)
  if (error) {
    console.warn("Dashboard API error:", error);
  }

  const {
    metrics = [],
    revenueData = [],
    salesPipeline = [],
    inquirySources = [],
    productPerformance = [],
    attendance = [],
    recentActivity = [],
  } = dashboardData || {};

  // Transform sales pipeline data for horizontal bar chart
  const transformedSalesPipeline = salesPipeline.map(
    (item: SalesPipelineItem) => ({
      status: item.status,
      count: item.count,
      value: item.value,
    })
  );

  // Transform product performance data to handle the revenue object structure
  const transformedProductPerformance = productPerformance.map(
    (item: ProductPerformanceItem) => ({
      category: item.category,
      inquiries: item.inquiries,
      quotations: item.quotations,
      revenue:
        typeof item.revenue === "object" && item.revenue.d
          ? item.revenue.d[0] || 0
          : item.revenue || 0,
    })
  );

  // Create mock revenue trend data if empty
  const revenueTrendData =
    revenueData.length > 0
      ? revenueData
      : [
          { month: "Jan", revenue: 0, target: 50000 },
          { month: "Feb", revenue: 0, target: 55000 },
          { month: "Mar", revenue: 0, target: 60000 },
          { month: "Apr", revenue: 0, target: 65000 },
          { month: "May", revenue: 0, target: 70000 },
          { month: "Jun", revenue: 0, target: 75000 },
        ];

  // Create mock attendance data if empty
  const attendanceData =
    attendance.length > 0
      ? attendance
      : [
          { day: "Mon", present: 0, late: 0, absent: 0 },
          { day: "Tue", present: 0, late: 0, absent: 0 },
          { day: "Wed", present: 0, late: 0, absent: 0 },
          { day: "Thu", present: 0, late: 0, absent: 0 },
          { day: "Fri", present: 0, late: 0, absent: 0 },
        ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your business performance
          </p>
          {error && (
            <p className="text-orange-600 text-sm mt-1">
              ⚠️ Using cached data - API temporarily unavailable
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {range}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric: Metric, index: number) => {
          const IconComponent =
            iconMap[metric.icon as keyof typeof iconMap] || Target;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-full ${metric.color} bg-opacity-10`}
                  >
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₱${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stackId="2"
                  stroke="#ef4444"
                  fill="none"
                  strokeDasharray="5 5"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Pipeline */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Sales Pipeline
            </CardTitle>
            <CardDescription>Lead status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedSalesPipeline} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "count") return [value, "Count"];
                    if (name === "value")
                      return [`₱${value.toLocaleString()}`, "Value"];
                    return [value, name];
                  }}
                />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry Sources */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              Inquiry Sources
            </CardTitle>
            <CardDescription>Where leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inquirySources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, count }) => `${source}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {inquirySources.map((entry: InquirySource, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Product Performance
            </CardTitle>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transformedProductPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" />
                <Bar dataKey="quotations" fill="#10b981" name="Quotations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-600" />
              Attendance Overview
            </CardTitle>
            <CardDescription>Weekly attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="present"
                  stackId="a"
                  fill="#10b981"
                  name="Present"
                />
                <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                <Bar
                  dataKey="absent"
                  stackId="a"
                  fill="#ef4444"
                  name="Absent"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest business activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity: RecentActivityItem) => {
              const IconComponent =
                iconMap[activity.icon as keyof typeof iconMap] || Calendar;
              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
