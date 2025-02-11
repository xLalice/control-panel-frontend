export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Lead {
  id: string;
  [key: string]: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  pageSize: number;
}

export interface PostMetric {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  fetchedAt: string;
}

export interface Post {
  id: string;
  fbPostId: string;
  postType: "image" | "video" | "text";
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  createdAt: string;
  engagementRate: number;
  metrics: PostMetric[];
}

export interface PageMetric {
  fetchedAt: string;
  followerCount: number;
  pageViews: number;
  pageImpressions: number;
  pageReach: number;
}

export interface MetricTrend {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

interface UpdateLeadParams {
  [key: string]: string;
}
