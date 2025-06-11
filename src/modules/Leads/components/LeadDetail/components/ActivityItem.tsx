import { Clock } from "lucide-react";
import { formatDateTime } from "../leadDetails.utils";
import { ActivityLog, ActivityLogMetadata } from "@/modules/Leads/types/leads.types";

interface ActivityItemProps {
  activity: ActivityLog;
}

export const ActivityItem = ({ activity }: ActivityItemProps): JSX.Element => {
  const renderMetadataChanges = (metadata: ActivityLogMetadata) => {
    // Check if metadata is an array (for LEAD_UPDATED)
    if (Array.isArray(metadata) && metadata.length > 0) {
      return (
        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-0.5">
          {metadata.map((change, index) => (
            <li key={index}>
              <span className="font-semibold capitalize">
                {change.field.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              : From "<span className="text-gray-500">{change.old || 'N/A'}</span>" to "
              <span className="font-medium text-gray-800">{change.new || 'N/A'}</span>"
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const formattedAction = activity.action
    .replace(/([A-Z])/g, ' $1') 
    .replace(/^_/, '') 
    .trim()
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(' '); 

  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-5 w-5 text-gray-500" />
        </div>
        <div className="h-full w-px bg-gray-200"></div>
      </div>

      <div className="pb-8 flex-grow"> 
        <p className="text-sm text-gray-500">
          {formatDateTime(activity.createdAt)}
        </p>
        <h4 className="font-medium text-base mb-1">{formattedAction}</h4>
        
        {activity.action !== "LEAD_UPDATED" && activity.description && (
          <p className="text-gray-600 text-sm">{activity.description}</p>
        )}

        {activity.action === "LEAD_UPDATED" && renderMetadataChanges(activity.metadata)}
        
        {activity.user && activity.user.name && (
          <p className="text-xs text-gray-400 mt-1">By {activity.user.name}</p>
        )}
      </div>
    </div>
  );
};