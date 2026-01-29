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
  FileText,
  Calendar,
  Clock,
  Target,
  Phone,
} from "lucide-react";
import { apiClient } from "@/api/axios";
import { DashboardData, iconMap, Metric } from "./stats.types";

const Stats: React.FC = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", timeRange],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard", {
        params: { timeRange },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });

  if (isLoading && !dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
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

  const chartRevenueData =
    revenueData.length > 0
      ? revenueData
      : [
          { month: "Jan", revenue: 0, target: 50000 },
          { month: "Feb", revenue: 0, target: 50000 },
          { month: "Mar", revenue: 0, target: 50000 },
        ];

  const chartAttendanceData =
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your business performance
          </p>
          {error && (
            <p className="text-orange-600 text-sm mt-1 flex items-center">
              <span className="mr-2">⚠️</span> Using cached data - API temporarily unavailable
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
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric: Metric, index: number) => {
          const IconComponent =
            iconMap[metric.icon] || Target;
            
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
                    className={`p-3 rounded-full ${metric.color.replace('text-', 'bg-').replace('600', '100')}`}
                  >
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <AreaChart data={chartRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, ""]}
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
              <BarChart data={salesPipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} fontSize={12} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value: number, name: string) => {
                    if (name === "count") return [value, "Count"];
                    if (name === "value")
                      return [`₱${value.toLocaleString()}`, "Value"];
                    return [value, name];
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
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
                  label={({ source, percent }) => 
                    percent > 0.1 ? `${source} ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {inquirySources.map((entry, index) => (
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
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quotations" fill="#10b981" name="Quotations" radius={[4, 4, 0, 0]} />
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
              <BarChart data={chartAttendanceData}>
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
            {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No recent activity found.</p>
            ) : (
                recentActivity.map((activity) => {
                const IconComponent =
                    iconMap[activity.icon] || Calendar;
                    
                return (
                    <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    <div className="p-2 rounded-full bg-blue-50">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                        {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                    </div>
                );
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;