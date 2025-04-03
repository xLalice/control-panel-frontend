import { useMemo } from 'react'; 
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

const STATUS_ORDER: ReadonlyArray<string> = ['New', 'Quoted', 'Approved', 'Scheduled', 'Fulfilled', 'Cancelled'];

const STATUS_COLORS: Readonly<{ [key: string]: { bg: string; chart: string } }> = {
  'New':       { bg: 'bg-blue-100',    chart: '#3B82F6' }, 
  'Quoted':    { bg: 'bg-yellow-100',  chart: '#F59E0B' }, 
  'Approved':  { bg: 'bg-emerald-100', chart: '#10B981' },
  'Scheduled': { bg: 'bg-orange-100',  chart: '#F97316' }, 
  'Fulfilled': { bg: 'bg-teal-100',    chart: '#14B8A6' }, 
  'Cancelled': { bg: 'bg-red-100',     chart: '#EF4444' }, 
  'Default':   { bg: 'bg-gray-100',    chart: '#6B7280' }, 
};
const GENERAL_CHART_COLORS: ReadonlyArray<string> = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57', '#FFC658'];

const getStatusColor = (status: string, type: 'bg' | 'chart'): string => {
  return (STATUS_COLORS[status] || STATUS_COLORS['Default'])[type];
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
      sourceDistribution: data.bySource.map(item => ({
        name: item.source,
        value: item.count,
      })),
      productTypeData: data.byProductType.map(item => ({
        name: item.productType,
        value: item.count,
      })),
      statusData: statusCounts.map(item => ({
        name: item.status,
        value: item.count,
      })),
      monthlyData: (data.monthlyTrends ?? []).map(item => ({
        
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        inquiries: item.count,
      })),
    };

    return {
      statusCounts, 
      chartData,    
    };
  }, [data]); 

  

  if (isLoading) {
    return <div className="flex justify-center items-center p-8 h-64"><p>Loading statistics...</p></div>;
  }

  if (isError) {
    
    return <div className="flex justify-center p-8 text-red-600 bg-red-100 border border-red-300 rounded-md">Error loading statistics: {error?.message || 'Unknown error'}</div>;
  }

  if (!data || !processedData) {
    return <div className="flex justify-center p-8 text-gray-600">No statistics data available for the selected period.</div>;
  }

  const { statusCounts, chartData } = processedData;

  return (
    <div className="space-y-6 p-4 md:p-6">
    
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Inquiry Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
             <div className="p-4 bg-indigo-100 rounded-lg">
                <p className="text-sm font-medium text-indigo-800">Total Inquiries</p>
                <p className="text-3xl font-bold text-indigo-900">{data.totalInquiries}</p>
              </div>
             <div className="p-4 bg-purple-100 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-900">{data.conversionRate.toFixed(1)}%</p>
             </div>
             {statusCounts.slice(0, 2).map(({ status, count }) => (
                 <div key={status} className={`${getStatusColor(status, 'bg')} p-4 rounded-lg`}>
                   <p className="text-sm font-medium text-gray-700">{status}</p>
                   <p className="text-3xl font-bold text-gray-900">{count}</p>
                 </div>
             ))}
          </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-4 border-t mt-4">
               {statusCounts.slice(2).map(({ status, count }) => (
                   <div key={status} className={`${getStatusColor(status, 'bg')} p-3 rounded-lg`}>
                     <p className="text-xs font-medium text-gray-600">{status}</p>
                     <p className="text-xl font-semibold text-gray-800">{count}</p>
                   </div>
               ))}
           </div>
        </CardContent>
      </Card>

      
      <Tabs defaultValue="trends" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
           <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
           <TabsTrigger value="sources">Source Analysis</TabsTrigger>
           <TabsTrigger value="products">Product Analysis</TabsTrigger>
           <TabsTrigger value="status">Status Breakdown</TabsTrigger>
        </TabsList>

        {/* Monthly Trends Tab */}
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Inquiries Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData.monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{fontSize: '13px', borderRadius: '4px'}} />
                  <Legend wrapperStyle={{fontSize: '14px'}}/>
                  <Bar dataKey="inquiries" fill={STATUS_COLORS['New'].chart} name="Total Inquiries" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Source Analysis Tab */}
        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries by Source</CardTitle>
            </CardHeader>
            <CardContent>
               {chartData.sourceDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                     <PieChart>
                        <Pie
                          data={chartData.sourceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false} 
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="value"
                          
                          label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                            const x = cx + (outerRadius + 15) * Math.cos(-midAngle * (Math.PI / 180)); // Position label outside
                            const y = cy + (outerRadius + 15) * Math.sin(-midAngle * (Math.PI / 180));
                            if (percent < 0.03) return null; // Hide label for very small slices
                            return (
                              <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                {`${name} (${(percent * 100).toFixed(0)}%)`}
                              </text>
                            );
                          }}
                        >
                          {chartData.sourceDistribution.map((entry, index) => (
                            <Cell key={`cell-${entry.name}-${index}`} fill={GENERAL_CHART_COLORS[index % GENERAL_CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`${value} Inquiries`, name]} contentStyle={{fontSize: '13px', borderRadius: '4px'}}/>
                        <Legend wrapperStyle={{fontSize: '14px'}} align="center" layout="horizontal" verticalAlign="bottom"/>
                     </PieChart>
                   </ResponsiveContainer>
               ) : (
                   <p className="text-center text-gray-500">No source data available.</p>
               )}
            </CardContent>
          </Card>
        </TabsContent>

         {/* Product Analysis Tab */}
         <TabsContent value="products" className="mt-4">
            <Card>
              <CardHeader>
                 <CardTitle>Inquiries by Product/Service</CardTitle>
              </CardHeader>
              <CardContent>
                 {chartData.productTypeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(300, chartData.productTypeData.length * 40)}>
                      <BarChart data={chartData.productTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} interval={0} />
                          <Tooltip formatter={(value: number) => [`${value} Inquiries`, undefined]} contentStyle={{fontSize: '13px', borderRadius: '4px'}} />
                          <Legend wrapperStyle={{fontSize: '14px'}} />
                          <Bar dataKey="value" name="Number of Inquiries" fill={STATUS_COLORS['Approved'].chart} radius={[0, 4, 4, 0]} barSize={25} />
                      </BarChart>
                    </ResponsiveContainer>
                 ) : (
                   <p className="text-center text-gray-500">No product type data available.</p>
                 )}
              </CardContent>
            </Card>
         </TabsContent>

        {/* Status Breakdown Tab */}
        <TabsContent value="status" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
               {chartData.statusData.length > 0 ? (
                 <div>
                   <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={chartData.statusData.filter(d => d.value > 0)} // Don't show 0-value slices
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                             const x = cx + (outerRadius + 15) * Math.cos(-midAngle * (Math.PI / 180));
                             const y = cy + (outerRadius + 15) * Math.sin(-midAngle * (Math.PI / 180));
                             if (percent < 0.03) return null;
                             return (
                               <text x={x} y={y} fill={getStatusColor(name, 'chart')} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                 {`${name} (${(percent * 100).toFixed(0)}%)`}
                               </text>
                             );
                          }}
                        >
                          {chartData.statusData.filter(d => d.value > 0).map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={getStatusColor(entry.name, 'chart')} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`${value} Inquiries`, name]} contentStyle={{fontSize: '13px', borderRadius: '4px'}}/>
                        <Legend wrapperStyle={{fontSize: '14px'}} align="center" layout="horizontal" verticalAlign="bottom"/>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
               ) : (
                   <p className="text-center text-gray-500">No status data available.</p>
               )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InquiryStats;