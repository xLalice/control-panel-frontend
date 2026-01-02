import {
    BarChart, DollarSign, Mail, Briefcase, Tag, FileText, Clock, Users,
    ScrollText
} from "lucide-react";

interface UserPermissions {
    canManageUsers: boolean;
    canReadUsers: boolean;
    canReadAllLeads: boolean;
    canReadOwnLeads: boolean;
    canReadAssignedLeads: boolean;
    canReadReports: boolean;
    canManageProducts: boolean;
    canReadProducts: boolean;
    canReadDocuments: boolean;
    canReadAttendance: boolean;
    canReadInquiries: boolean;
}

export const getMenuItems = (perms: UserPermissions) => [
    {
        name: "Dashboard",
        route: "/dashboard",
        icon: <BarChart className="h-4 w-4" />,
        visible: true,
    },
    {
        name: "Leads",
        route: "/leads",
        icon: <DollarSign className="h-4 w-4" />,
        visible: perms.canReadAllLeads || perms.canReadOwnLeads || perms.canReadAssignedLeads,
    },
    {
        name: "Inquiries",
        route: "/inquiries",
        icon: <Mail className="h-4 w-4" />,
        visible: perms.canReadInquiries,
    },
    {
        name: "Quotations",
        route: "/quotes", 
        icon: <ScrollText className="h-4 w-4" />,
        visible: perms.canReadAllLeads || perms.canReadOwnLeads || perms.canReadAssignedLeads,
    },
    {
        name: "Clients",
        route: "/clients",
        icon: <Briefcase className="h-4 w-4" />,
        visible: true,
    },
    {
        name: "Products",
        route: "/products",
        icon: <Tag className="h-4 w-4" />,
        visible: perms.canManageProducts || perms.canReadProducts,
    },
    {
        name: "Documents",
        route: "/documents",
        icon: <FileText className="h-4 w-4" />,
        visible: perms.canReadDocuments,
    },
    {
        name: "View Reports",
        route: "/reports",
        icon: <BarChart className="h-4 w-4" />,
        visible: perms.canReadReports,
    },
    {
        name: "Attendance",
        route: "/attendance",
        icon: <Clock className="h-4 w-4" />,
        visible: perms.canReadAttendance,
    },
    {
        name: "User Management",
        route: "/user-management",
        icon: <Users className="h-4 w-4" />,
        visible: perms.canManageUsers || perms.canReadUsers,
    },
];