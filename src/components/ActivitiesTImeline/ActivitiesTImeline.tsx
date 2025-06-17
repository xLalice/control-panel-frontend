import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTimelineSkeleton } from "./ActivitiesSkeleton";
import { ActivityLog, EntityType } from "@/types/sharedTypes";
import { ActivityItem } from "./ActivityItem";
import { useActivitiesData } from "./useActivitiesData";
import { AlertTriangle, CalendarOff } from "lucide-react";

interface ActivitiesTimelineProps {
  entityType: EntityType;
  entityId: string;
}

export const ActivitiesTimeline: React.FC<ActivitiesTimelineProps> = ({
  entityType,
  entityId,
}) => {
  const { data: activities, isLoading, error } = useActivitiesData({
    entityId,
    entityType,
  });

  const renderContent = () => {
    if (isLoading) {
      return <ActivityTimelineSkeleton />;
    }

    if (error) {
      return <ErrorState message={`Failed to load activities for this ${entityType}.`} />;
    }

    if (!activities || activities.length === 0) {
      return <EmptyState message={`No activities recorded for this ${entityType}.`} />;
    }

    return (
      <div className="relative space-y-6">
        <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
        {activities.map((activity: ActivityLog) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          A chronological history of activities for this {entityType}.
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