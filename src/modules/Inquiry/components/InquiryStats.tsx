import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle,
  Tabs, TabsContent, TabsList, TabsTrigger
 } from '@/components/ui';

import {
  BarChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Package,
  Target,
  MessageSquare,
  Eye,
  UserPlus,
  Users,
  FileText,
  Truck
} from 'lucide-react';
import { getInquiryStatistics } from '@/api/api';
import { InquiryStatistics } from '../types';

const STATUS_ORDER = ['New', 'Reviewed', 'ConvertedToLead', 'AssociatedToClient', 'QuotationGenerated', 'DeliveryScheduled', 'Closed'] as const;

const STATUS_CONFIG = {
  'New': { 
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
    chart: '#3B82F6', 
    icon: MessageSquare,
    border: 'border-blue-200',
    text: 'text-blue-800'
  },
  'Reviewed': { 
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
    chart: '#8B5CF6', 
    icon: Eye,
    border: 'border-purple-200',
    text: 'text-purple-800'
  },
  'ConvertedToLead': { 
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', 
    chart: '#6366F1', 
    icon: UserPlus,
    border: 'border-indigo-200',
    text: 'text-indigo-800'
  },
  'AssociatedToClient': { 
    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100', 
    chart: '#06B6D4', 
    icon: Users,
    border: 'border-cyan-200',
    text: 'text-cyan-800'
  },
  'QuotationGenerated': { 
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', 
    chart: '#F59E0B', 
    icon: FileText,
    border: 'border-yellow-200',
    text: 'text-yellow-800'
  },
  'DeliveryScheduled': { 
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100', 
    chart: '#F97316', 
    icon: Truck,
    border: 'border-orange-200',
    text: 'text-orange-800'
  },
  'Closed': { 
    bg: 'bg-gradient-to-br from-emerald-50 to-green-100', 
    chart: '#10B981', 
    icon: CheckCircle,
    border: 'border-emerald-200',
    text: 'text-emerald-800'
  },
  'Default': { 
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100', 
    chart: '#6B7280', 
    icon: AlertCircle,
    border: 'border-gray-200',
    text: 'text-gray-800'
  },
};

const PRIORITY_COLORS = {
  'Low': '#10B981',
  'Medium': '#F59E0B', 
  'High': '#F97316',
  'Urgent': '#EF4444'
};

const REFERENCE_SOURCE_COLORS = {
  'Facebook': '#1877F2',
  'Instagram': '#E4405F',
  'TikTok': '#000000',
  'Referral': '#8B5CF6',
  'Flyers': '#06B6D4',
  'Other': '#6B7280'
};

const INQUIRY_TYPE_COLORS = {
  'PricingRequest': '#3B82F6',
  'ProductAvailability': '#10B981',
  'TechnicalQuestion': '#8B5CF6',
  'DeliveryInquiry': '#F97316',
  'Other': '#6B7280'
};

const DELIVERY_METHOD_COLORS = {
  'Delivery': '#10B981',
  'Pickup': '#F59E0B',
  'ThirdParty': '#8B5CF6'
};

const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['Default'];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, className = "" }: any) => (
  <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatusCard = ({ status, count }: { status: string; count: number }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  return (
    <Card className={`${config.bg} ${config.border} border transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={`text-sm font-medium ${config.text}`}>{status.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
          <Icon className={`h-5 w-5 ${config.text}`} />
        </div>
      </CardContent>
    </Card>
  );
};

function InquiryStats() {
  const { data, isLoading, isError, error } = useQuery<InquiryStatistics, Error>({
    queryKey: ['inquiryStats'],
    queryFn: () => getInquiryStatistics(),
  });

  const processedData = useMemo(() => {
    if (!data) return null;

    const statusCounts = STATUS_ORDER.map(status => ({
      status,
      count: data.byStatus.find(item => item.status === status)?.count ?? 0,
    }));

    const chartData = {
      referenceSourceData: data.byReferenceSource?.map(item => ({
        name: item.referenceSource,
        value: item.count,
        color: REFERENCE_SOURCE_COLORS[item.referenceSource as keyof typeof REFERENCE_SOURCE_COLORS] || '#6B7280'
      })) || [],
      inquiryTypeData: data.byInquiryType?.map(item => ({
        name: item.inquiryType.replace(/([A-Z])/g, ' $1').trim(),
        value: item.count,
        color: INQUIRY_TYPE_COLORS[item.inquiryType as keyof typeof INQUIRY_TYPE_COLORS] || '#6B7280'
      })) || [],
      priorityData: data.byPriority?.map(item => ({
        name: item.priority,
        value: item.count,
        color: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS] || '#6B7280'
      })) || [],
      deliveryMethodData: data.byDeliveryMethod?.map(item => ({
        name: item.deliveryMethod,
        value: item.count,
        color: DELIVERY_METHOD_COLORS[item.deliveryMethod as keyof typeof DELIVERY_METHOD_COLORS] || '#6B7280'
      })) || [],
      statusData: statusCounts.map(item => ({
        name: item.status.replace(/([A-Z])/g, ' $1').trim(),
        value: item.count,
        color: getStatusConfig(item.status).chart
      })),
      monthlyData: (data.monthlyTrends ?? []).map(item => ({
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        inquiries: item.count,
        converted: item.converted || 0,
        closed: item.closed || 0,
      })),
      dailyData: (data.dailyTrends ?? []).map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inquiries: item.count,
      })),
    };

    return {
      statusCounts,
      chartData,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">Error loading statistics</p>
          <p className="text-red-600 text-sm mt-2">{error?.message || 'Unknown error occurred'}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !processedData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No statistics data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  const { statusCounts, chartData } = processedData;

  // Calculate active inquiries (everything except Closed)
  const activeInquiries = statusCounts.filter(s => s.status !== 'Closed').reduce((sum, s) => sum + s.count, 0);
  
  // Calculate conversion rate (ConvertedToLead / Total Inquiries)
  const convertedToLeadCount = statusCounts.find(s => s.status === 'ConvertedToLead')?.count || 0;
  const conversionRate = data.totalInquiries > 0 ? (convertedToLeadCount / data.totalInquiries) * 100 : 0;

  return (
    <div className="space-y-8 p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inquiries"
          value={data.totalInquiries}
          icon={MessageSquare}
          trend="up"
          trendValue="+12%"
          subtitle="All time"
        />
        <StatCard
          title="Lead Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={Target}
          trend="up"
          trendValue="+2.3%"
          subtitle="Inquiry to lead"
        />
        <StatCard
          title="Active Inquiries"
          value={activeInquiries}
          icon={Clock}
          subtitle="Pending processing"
        />
        <StatCard
          title="Closed Inquiries"
          value={statusCounts.find(s => s.status === 'Closed')?.count || 0}
          icon={CheckCircle}
          trend="up"
          trendValue="+8%"
          subtitle="Completed"
        />
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            <span>Inquiry Status Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {statusCounts.map(({ status, count }) => (
              <StatusCard key={status} status={status} count={count} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="trends" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Trends
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Sources
          </TabsTrigger>
          <TabsTrigger value="types" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Types
          </TabsTrigger>
          <TabsTrigger value="priority" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Priority
          </TabsTrigger>
          <TabsTrigger value="delivery" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Delivery
          </TabsTrigger>
          <TabsTrigger value="status" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Status
          </TabsTrigger>
        </TabsList>

        {/* Monthly Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Inquiry Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.monthlyData}>
                    <defs>
                      <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="inquiries" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorInquiries)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Closed vs Lead Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="closed" fill="#10B981" name="Closed" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="leads" fill="#6366F1" name="Converted to Lead" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reference Sources */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries by Reference Source</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.referenceSourceData.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={chartData.referenceSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                          if (percent < 0.05) return null;
                          const x = cx + (outerRadius + 20) * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + (outerRadius + 20) * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="currentColor"
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                              fontSize={12}
                              fontWeight="medium"
                            >
                              {`${name} (${(percent * 100).toFixed(0)}%)`}
                            </text>
                          );
                        }}
                      >
                        {chartData.referenceSourceData.map((entry, index) => (
                          <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {chartData.referenceSourceData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-lg font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No reference source data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inquiry Types */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries by Type</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.inquiryTypeData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={Math.max(300, chartData.inquiryTypeData.length * 60)}>
                    <BarChart data={chartData.inquiryTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.inquiryTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chartData.inquiryTypeData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-lg font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No inquiry type data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Priority Analysis */}
        <TabsContent value="priority">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries by Priority Level</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.priorityData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.priorityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                          if (percent < 0.05) return null;
                          const x = cx + (outerRadius + 15) * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + (outerRadius + 15) * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                              {`${name} (${(percent * 100).toFixed(0)}%)`}
                            </text>
                          );
                        }}
                      >
                        {chartData.priorityData.map((entry, index) => (
                          <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {chartData.priorityData.map((item) => (
                      <div key={item.name} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }}></div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-2xl font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No priority data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Methods */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.deliveryMethodData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData.deliveryMethodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.deliveryMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chartData.deliveryMethodData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xl font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No delivery method data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Breakdown */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartData.statusData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                        if (percent < 0.03) return null;
                        const x = cx + (outerRadius + 20) * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + (outerRadius + 20) * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="medium">
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {chartData.statusData.filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InquiryStats;