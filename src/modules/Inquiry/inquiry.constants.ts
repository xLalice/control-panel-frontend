import { 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Eye,
  UserPlus,
  Users,
  FileText,
  Truck
} from 'lucide-react';

export const STATUS_ORDER = ['New', 'Reviewed', 'ConvertedToLead', 'AssociatedToClient', 'QuotationGenerated', 'DeliveryScheduled', 'Closed'] as const;

export const STATUS_CONFIG = {
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

export const PRIORITY_COLORS = {
  'Low': '#10B981',
  'Medium': '#F59E0B', 
  'High': '#F97316',
  'Urgent': '#EF4444'
};

export const REFERENCE_SOURCE_COLORS = {
  'Facebook': '#1877F2',
  'Instagram': '#E4405F',
  'TikTok': '#000000',
  'Referral': '#8B5CF6',
  'Flyers': '#06B6D4',
  'Other': '#6B7280'
};

export const INQUIRY_TYPE_COLORS = {
  'PricingRequest': '#3B82F6',
  'ProductAvailability': '#10B981',
  'TechnicalQuestion': '#8B5CF6',
  'DeliveryInquiry': '#F97316',
  'Other': '#6B7280'
};

export const DELIVERY_METHOD_COLORS = {
  'Delivery': '#10B981',
  'Pickup': '#F59E0B',
  'ThirdParty': '#8B5CF6'
};