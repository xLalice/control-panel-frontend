// components/common/ContactHistoryTimeline/ContactHistoryTimeline.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTimelineSkeleton } from "./ActivitiesSkeleton";
import { EntityType, ContactHistory } from "@/types/sharedTypes"; 
import { useContactHistoryData } from "./useContactHIstoryData";
import { ContactHistoryItem } from "./useContactHistoryItem";
import { CalendarOff, AlertTriangle } from "lucide-react"; 
import React from "react";

interface ContactHistoryTimelineProps {
  entityType: EntityType;
  entityId: string;
}

export const ContactHistoryTimeline: React.FC<ContactHistoryTimelineProps> = ({
  entityType,
  entityId,
}) => {
  const { data: contactHistory, isLoading, error } = useContactHistoryData({
    entityId,
    entityType,
  });

  const renderContent = () => {
    if (isLoading) {
      return <ActivityTimelineSkeleton />;
    }

    if (error) {
      return <ErrorState message={`Failed to load contact history for this ${entityType}.`} />;
    }

    if (!contactHistory || contactHistory.length === 0) {
      return <EmptyState message={`No contact history recorded for this ${entityType}.`} />;
    }

    return (
      <div className="relative space-y-6">
        <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
        {contactHistory.map((contact: ContactHistory) => (
          <ContactHistoryItem key={contact.id} contact={contact} />
        ))}
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Contact History</CardTitle>
        <CardDescription>
          A chronological history of direct contacts for this {entityType}.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarOff className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">{message}</p>
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center text-red-600 bg-red-50 rounded-md">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="font-medium">{message}</p>
    </div>
);