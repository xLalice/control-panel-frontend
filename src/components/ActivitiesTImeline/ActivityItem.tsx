import {
  Edit,
  Mail,
  MessageSquare,
  PlusCircle,
  User,
  UserPlus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ActivityLog, ActivityLogMetadata } from "@/types/sharedTypes";
interface ActivityItemProps {
  activity: ActivityLog;
}

const actionIcons: { [key: string]: React.ElementType } = {
  LEAD_CREATED: UserPlus,
  LEAD_UPDATED: Edit,
  NOTE_ADDED: MessageSquare,
  EMAIL_SENT: Mail,
  DEFAULT: PlusCircle,
};


export const ActivityItem = ({ activity }: ActivityItemProps): JSX.Element => {
  const Icon = actionIcons[activity.action] || actionIcons.DEFAULT;

  const renderMetadataChanges = (metadata: ActivityLogMetadata) => {
    if (!Array.isArray(metadata) || metadata.length === 0) {
      return null;
    }

    return (
      <dl className="mt-2 space-y-1 text-sm text-gray-700">
        {metadata.map((change, index) => (
          <div key={index} className="flex gap-1">
            <dt className="font-semibold capitalize">
              {change.field.replace(/([A-Z])/g, " $1").trim()}:
            </dt>
            <dd className="flex items-center gap-1.5">
              <span className="line-through text-gray-500">
                {change.old || "empty"}
              </span>
              <span>&rarr;</span>
              <span className="font-medium text-gray-900">
                {change.new || "empty"}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    );
  };

  const formattedAction = activity.action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="relative flex items-start gap-4">
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-8 ring-white">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-grow pt-1.5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base">{formattedAction}</h4>
          <time className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
            })}
          </time>
        </div>

        {activity.action !== "LEAD_UPDATED" && activity.description && (
          <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
        )}

        {activity.action === "LEAD_UPDATED" &&
          renderMetadataChanges(activity.metadata)}

        {activity.user && activity.user.name && (
          <div className="mt-2 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-gray-500">
              {activity.user.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};