import { useEffect, useState } from "react";
import {
  LineChart,
  PieChart,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Post, PageMetric } from "@/types";
import { format } from "date-fns";
import { fetchFacebookOverview } from "@/api/api";

// Color Constants
const COLORS = {
  primary: "#000000",
  secondary: "#FFFFFF",
  accent: "#D4AF37",
  background: "#0A0A0A",
  cardBackground: "#171717",
};

const SocialMediaDashboard = () => {
  const [overview, setOverview] = useState<{
    posts: Post[];
    pageMetrics: PageMetric[];
    historicalMetrics?: {
      date: string;
      engagementRate: number;
      followerCount: number;
      impressions: number;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFacebookOverview();
        setOverview(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processHistoricalData = (
  metrics: { engagementRate: number; followerCount: number; impressions: number; date: string }[] | undefined
) => {
  if (!metrics || metrics.length === 0) return []; // Handle undefined or empty array case

  // Group metrics by date (day) to avoid multiple entries per day
  const groupedByDay = metrics.reduce((acc, metric) => {
    const day = format(new Date(metric.date), "yyyy-MM-dd");
    if (!acc[day]) {
      acc[day] = {
        engagementRate: metric.engagementRate,
        followerCount: metric.followerCount,
        impressions: metric.impressions,
        count: 1,
      };
    } else {
      acc[day].engagementRate += metric.engagementRate;
      acc[day].followerCount = metric.followerCount; // Take latest follower count
      acc[day].impressions += metric.impressions;
      acc[day].count += 1;
    }
    return acc;
  }, {} as Record<string, { engagementRate: number; followerCount: number; impressions: number; count: number }>);

  // Convert grouped data to array and calculate averages
  return Object.entries(groupedByDay)
    .map(([date, metrics]) => ({
      date: format(new Date(date), "MMM dd"),
      engagementRate: (metrics.engagementRate / metrics.count).toFixed(2),
      followers: metrics.followerCount,
      impressions: Math.round(metrics.impressions / metrics.count),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};


  if (loading)
    return (
      <div className="text-center p-8 text-gold-500">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );

  if (!overview)
    return (
      <div className="text-center p-8 text-gold-500">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-xl font-semibold">📭 No data available</p>
          <p className="mt-2 text-gray-400">
            Connect your Facebook account to get started
          </p>
        </div>
      </div>
    );

  // Calculate total reactions using the latest metrics for each post
  const totalLikes = overview.posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = overview.posts.reduce(
    (sum, post) => sum + post.comments,
    0
  );
  const totalShares = overview.posts.reduce(
    (sum, post) => sum + post.shares,
    0
  );

  const postTypeDistribution = overview.posts.reduce((acc, post) => {
    acc[post.postType] = (acc[post.postType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPosts = [...overview.posts]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Likes" value={totalLikes} />
        <MetricCard title="Total Comments" value={totalComments} />
        <MetricCard title="Total Shares" value={totalShares} />
        <MetricCard
          title="Followers"
          value={
            overview.pageMetrics[overview.pageMetrics.length - 1]
              ?.followerCount || 0
          }
        />
      </div>

      {/* Engagement Trends */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Engagement Metrics Over Time
        </h2>
        <div className="h-96">
          {" "}
          {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processHistoricalData(overview.historicalMetrics)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#D4AF37"
                tick={{ fill: "#D4AF37" }}
                tickMargin={10}
              />
              <YAxis
                yAxisId="left"
                stroke="#D4AF37"
                tick={{ fill: "#D4AF37" }}
                tickMargin={10}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#60A5FA"
                tick={{ fill: "#60A5FA" }}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: COLORS.cardBackground,
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: COLORS.secondary,
                }}
                formatter={(value: number, name: string) => {
                  switch (name) {
                    case "engagementRate":
                      return [`${value}%`, "Engagement Rate"];
                    case "impressions":
                      return [value, "Impressions"];
                    case "followers":
                      return [value, "Followers"];
                    default:
                      return [value, name];
                  }
                }}
              />
              <Legend
                wrapperStyle={{ color: COLORS.secondary }}
                formatter={(value) => {
                  switch (value) {
                    case "engagementRate":
                      return "Engagement Rate";
                    case "impressions":
                      return "Impressions";
                    case "followers":
                      return "Followers";
                    default:
                      return value;
                  }
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="engagementRate"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="impressions"
                stroke="#60A5FA"
                strokeWidth={2}
                dot={{ fill: "#60A5FA", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="followers"
                stroke="#34D399"
                strokeWidth={2}
                dot={{ fill: "#34D399", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Post Type Distribution & Top Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gold-500">
            Content Distribution
          </h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(postTypeDistribution).map(
                    ([name, value]) => ({
                      name,
                      value,
                    })
                  )}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Object.keys(postTypeDistribution).map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? COLORS.accent : "#374151"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.cardBackground,
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: COLORS.secondary,
                  }}
                />
                <Legend
                  wrapperStyle={{ color: COLORS.secondary }}
                  formatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gold-500">
            Top Performers
          </h2>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <PostCard key={post.id} post={post} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Metric Card
const MetricCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gold-500 transition-colors">
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <p className="text-3xl font-bold mt-2 text-gold-500">
      {value.toLocaleString()}
    </p>
  </div>
);

// Enhanced Post Card
const PostCard = ({ post, rank }: { post: Post; rank: number }) => (
  <div className="flex items-start p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-gold-500 transition-all group">
    <span className="text-gold-500 text-sm font-bold mr-4">#{rank}</span>
    {post.mediaUrl && (
      <div className="relative w-16 h-16 mr-4 overflow-hidden rounded">
        <img
          src={post.mediaUrl}
          alt="Post media"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gold-500/20 group-hover:opacity-0 transition-opacity" />
      </div>
    )}
    <div className="flex-1">
      <p className="font-medium text-gray-300 line-clamp-2 group-hover:text-gold-500 transition-colors">
        {post.content || <span className="text-gray-500">No text content</span>}
      </p>
      <div className="flex gap-4 mt-2 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          👍 {post.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          💬 {post.comments.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          📤 {post.shares.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

export default SocialMediaDashboard;
