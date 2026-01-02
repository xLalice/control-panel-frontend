import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";

export const useUserPermissions = () => {
    // User Management
    const canManageUsers = useAppSelector((state) =>
        selectUserHasPermission(state, "manage:users")
    );
    const canReadUsers = useAppSelector((state) =>
        selectUserHasPermission(state, "read:users")
    );

    // Leads
    const canReadAllLeads = useAppSelector((state) =>
        selectUserHasPermission(state, "read:all_leads")
    );
    const canReadOwnLeads = useAppSelector((state) =>
        selectUserHasPermission(state, "read:own_leads")
    );
    const canReadAssignedLeads = useAppSelector((state) =>
        selectUserHasPermission(state, "read:assigned_leads")
    );

    // Quotes
    const canReadQuotes = useAppSelector((state) => 
        selectUserHasPermission(state, "read:all_quotations")
    )

    // Reports
    const canReadReports = useAppSelector((state) =>
        selectUserHasPermission(state, "read:own_reports") ||
        selectUserHasPermission(state, "read:all_reports")
    );

    // Products
    const canManageProducts = useAppSelector((state) =>
        selectUserHasPermission(state, "manage:products")
    );
    const canReadProducts = useAppSelector((state) =>
        selectUserHasPermission(state, "read:products")
    );

    // Documents
    const canReadDocuments = useAppSelector((state) =>
        selectUserHasPermission(state, "read:documents")
    );

    // Attendance
    const canReadAttendance = useAppSelector((state) =>
        selectUserHasPermission(state, "read:own_attendance") ||
        selectUserHasPermission(state, "read:all_attendance")
    );

    // Inquiries
    const canReadInquiries = useAppSelector((state) =>
        selectUserHasPermission(state, "read:own_inquiries") ||
        selectUserHasPermission(state, "read:assigned_inquiries") ||
        selectUserHasPermission(state, "read:all_inquiries")
    );

    return {
        canManageUsers,
        canReadUsers,
        canReadAllLeads,
        canReadOwnLeads,
        canReadAssignedLeads,
        canReadReports,
        canManageProducts,
        canReadProducts,
        canReadDocuments,
        canReadAttendance,
        canReadInquiries,
        canReadQuotes
    };
};