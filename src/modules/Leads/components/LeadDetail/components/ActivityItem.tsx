import { Clock } from "lucide-react";
import { formatDateTime } from "../leadDetails.utils";
import { ActivityLog } from "@/modules/Leads/types/leads.types";

/**
 * Props for the ActivityItem component.
 */
interface ActivityItemProps {
  activity: ActivityLog;
}

export const ActivityItem = ({ activity }: ActivityItemProps): JSX.Element => {
  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-5 w-5 text-gray-500" />
        </div>
        <div className="h-full w-px bg-gray-200"></div>
      </div>

      <div className="pb-8">
        <p className="text-sm text-gray-500">
          {formatDateTime(activity.createdAt)}
        </p>
        <h4 className="font-medium">{activity.action}</h4>
        {activity.description && (
           <p className="text-gray-600">{activity.description}</p>
        )}
        {activity.createdBy && (
          <p className="text-sm text-gray-400">By {activity.createdBy.name}</p>
        )}
        {activity.oldStatus && activity.newStatus && (
          <p className="text-sm text-gray-500">
            Status changed from{" "}
            <span className="font-medium">{activity.oldStatus}</span> to{" "}
            <span className="font-medium">{activity.newStatus}</span>
          </p>
        )}
      </div>
    </div>
  );
};