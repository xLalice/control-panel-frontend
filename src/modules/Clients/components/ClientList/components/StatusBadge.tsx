import { ClientStatus } from "@/modules/Clients/clients.schema";

export const StatusBadge = ({ status }: { status: ClientStatus }) => {
  const variants: Record<ClientStatus, string> = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-gray-100 text-gray-800 border-gray-200",
    OnHold: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}
    >
      {status}
    </span>
  );
};
