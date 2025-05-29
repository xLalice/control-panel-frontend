export interface ContactHistoryItem {
  id: string;
  clientId: string;
  userId: string;
  method: string;
  summary: string;
  outcome?: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ActivityLogItem {
  id: string;
  clientId: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InteractionHistoryProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}