import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'recharts';
import { getInquiryStatistics } from '@/api/api';
import { InquiryStatistics } from '../types';

interface ChartData {
  sourceDistribution: Array<{ name: string; value: number }>;
  productTypeData: Array<{ name: string; value: number }>;
  statusData: Array<{ name: string; value: number }>;
  monthlyData: Array<{ month: string; inquiries: number }>;
}

function InquiryStats() {
  const { data, isLoading, isError } = useQuery<InquiryStatistics>({
    queryKey: ['inquiryStats'],
    queryFn: () => getInquiryStatistics(),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading statistics...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-8 text-red-500">Error loading statistics</div>;
  }

  if (!data) {
    return <div className="flex justify-center p-8 text-yellow-500">No statistics data available</div>;
  }

  // Define status order and colors
  const statusOrder = ['New', 'Quoted', 'Approved', 'Scheduled', 'Fulfilled', 'Cancelled'];
  const statusColors: { [key: string]: string } = {
    'New': 'bg-blue-100',
    'Quoted': 'bg-yellow-100',
    'Approved': 'bg-green-100',
    'Scheduled': 'bg-orange-100',
    'Fulfilled': 'bg-teal-100',
    'Cancelled': 'bg-red-100',
  };

  // Calculate status counts
  const statusCounts = statusOrder.map(status => ({
    status,
    count: data.byStatus.find(item => item.status === status)?.count || 0,
  }));

  // Calculate conversion rate
  const fulfilledCount = statusCounts.find(item => item.status === 'Fulfilled')?.count || 0;
  const conversionRate = data.totalInquiries > 0 ? (fulfilledCount / data.totalInquiries) * 100 : 0;

  const chartData: ChartData = {
    sourceDistribution: data.byReferenceSource.map(item => ({
      name: item.source,
      value: item.count,
    })),
    productTypeData: data.byProductType.map(item => ({
      name: item.productType,
      value: item.count,
    })),
    statusData: data.byStatus.map(item => ({
      name: item.status,
      value: item.count,
    })),
    monthlyData: data.monthlyTrends!.map(item => ({
      month: new Date(item.month).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      inquiries: item.count,
    })),
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-4">
      {/* Overview Card - Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Total Inquiries</p>
            <p className="text-2xl font-bold">{data.totalInquiries}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className={`${statusColors[status]} p-4 rounded-lg text-center`}>
                <p className="text-lg font-medium">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-100 rounded-lg text-center">
            <p className="text-lg font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Source Analysis</TabsTrigger>
          <TabsTrigger value="status">Status Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inquiries" fill="#8884d8" name="Total Inquiries" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inquiry Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.sourceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.sourceDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product/Service Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.productTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Number of Inquiries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Source Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.sourceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.sourceDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InquiryStats;