import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; 
import { ActivityTimelineSkeleton } from "../../skeletons/DetailActivitiesSkeleton";
import { useLeadActivities } from "../hooks/useLeadActivities";
import { ActivityLog } from "@/modules/Leads/types/leads.types";
import { ActivityItem } from "./ActivityItem";

export const LeadActivities = ({ leadId }: { leadId: string }): JSX.Element => {
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useLeadActivities({ leadId });

  const renderContent = () => {
    if (isActivitiesLoading) {
      return <ActivityTimelineSkeleton />;
    }

    if (activitiesError) {
      return <ErrorState message="Failed to load activities." />;
    }

    if (!activities || activities.length === 0) {
      return <EmptyState message="No activities recorded for this lead." />;
    }

    return (
      <div className="space-y-4">
        {activities.map((activity: ActivityLog) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          A chronological history of activities for this lead
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};


const EmptyState = ({ message }: { message: string }) => (
  <div className="py-4 text-center text-gray-500">{message}</div>
);


const ErrorState = ({ message }: { message: string }) => (
  <div className="py-4 text-center text-red-500">{message}</div>
);