// components/common/ContactHistoryTimeline/ContactHistoryItem.tsx

import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { Phone, Mail, Calendar, MessageCircleMore } from "lucide-react"; // Example icons
import { ContactHistory } from "@/types/sharedTypes"; // Ensure correct import

interface ContactHistoryItemProps {
  contact: ContactHistory;
}

const methodIcons: { [key: string]: React.ElementType } = {
  Call: Phone,
  Email: Mail,
  Meeting: Calendar,
  SMS: MessageCircleMore,
  DEFAULT: MessageCircleMore,
};

export const ContactHistoryItem = ({ contact }: ContactHistoryItemProps): JSX.Element => {
  const Icon = methodIcons[contact.method] || methodIcons.DEFAULT;

  return (
    <div className="relative flex items-start gap-4">
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-grow pt-1.5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base capitalize">{contact.method}</h4>
          <time className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(contact.timestamp), {
              addSuffix: true,
            })}
          </time>
        </div>

        {contact.summary && (
          <p className="mt-1 text-sm text-gray-700">{contact.summary}</p>
        )}

        {contact.outcome && (
          <p className="mt-1 text-xs text-gray-500">Outcome: {contact.outcome}</p>
        )}
      </div>
    </div>
  );
};