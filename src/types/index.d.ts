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

export interface Report {
  id: string;
  date: Date;
  location: string;
  department: string;
  taskDetails: string;
  reportedBy: string;
}

// Equipment Item
interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string;
  manufacturer?: string;
  status: EquipmentStatus;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate?: number;
  imageUrl?: string;
  maintenanceSchedule?: Date;
  lastMaintenance?: Date;
  purchaseDate?: Date;
  priceHistory: EquipmentPriceHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Steel Item
interface Steel {
  id: string;
  size: string;
  grade: Grade;
  length: number;
  price: number;
  unit: string;
  stockLevel?: number;
  priceHistory: SteelPriceHistory[];
  createdAt: Date;
  updatedAt: Date;
}

enum Grade {
  Grade33 = "Grade33",
  Grade40 = "Grade40",
  Grade60 = "Grade60"
}

interface SteelPriceHistory {
  id: string;
  steelId: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  changedAt: Date;
}

// Aggregate Item
interface Aggregate {
    id: string;
    name: string;
    type: string; // e.g., Sand, Gravel, etc.
    source: Source; // Batangas or Montalban
    pickupPrice: number;
    deliveryPrice: number;
    unit: string; // e.g., cu.m
    stockLevel?: number;
    minStock?: number; // For alerts
    priceHistory: AggregatePriceHistory[];
    createdAt: Date;
    updatedAt: Date;
}

interface AggregatePriceHistory {
  id: string;
  aggregateId: string;
  oldPickupPrice: number;
  newPickupPrice: number;
  oldDeliveryPrice: number;
  newDeliveryPrice: number;
  changedBy: string;
  changedAt: Date;
}

// Price History
interface PriceHistory {
  date: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
}
