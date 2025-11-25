export const BadgeStatus = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        DRAFT: "bg-gray-100 text-gray-800",
        SENT: "bg-blue-100 text-blue-800",
        ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.DRAFT}`}>
            {status}
        </span>
    );
};