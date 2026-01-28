import { ROUTES } from "@/routes";
import {
    BarChart, DollarSign, Mail, Briefcase, Tag, FileText, Clock, Users,
    ScrollText,
    Truck
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
        route: ROUTES.DASHBOARD,
        icon: <BarChart className="h-4 w-4" />,
        visible: true,
    },
    {
        name: "Leads",
        route: ROUTES.LEADS,
        icon: <DollarSign className="h-4 w-4" />,
        visible: perms.canReadAllLeads || perms.canReadOwnLeads || perms.canReadAssignedLeads,
    },
    {
        name: "Inquiries",
        route: ROUTES.INQUIRIES,
        icon: <Mail className="h-4 w-4" />,
        visible: perms.canReadInquiries,
    },
    {
        name: "Quotations",
        route: ROUTES.QUOTES,
        icon: <ScrollText className="h-4 w-4" />,
        visible: perms.canReadAllLeads || perms.canReadOwnLeads || perms.canReadAssignedLeads,
    },
    {
        name: "Sales Orders",
        route: ROUTES.SALES_ORDERS,
        icon: <Truck className="h-4 w-4" />,
        visible: perms.canReadAllLeads || perms.canReadOwnLeads || perms.canReadAssignedLeads,
    },
    {
        name: "Clients",
        route: ROUTES.CLIENTS,
        icon: <Briefcase className="h-4 w-4" />,
        visible: true,
    },
    {
        name: "Products",
        route: ROUTES.PRODUCTS,
        icon: <Tag className="h-4 w-4" />,
        visible: perms.canManageProducts || perms.canReadProducts,
    },
    {
        name: "Documents",
        route: ROUTES.DOCUMENTS,
        icon: <FileText className="h-4 w-4" />,
        visible: perms.canReadDocuments,
    },
    {
        name: "View Reports",
        route: ROUTES.REPORTS,
        icon: <BarChart className="h-4 w-4" />,
        visible: perms.canReadReports,
    },
    {
        name: "Attendance",
        route: ROUTES.ATTENDANCE,
        icon: <Clock className="h-4 w-4" />,
        visible: perms.canReadAttendance,
    },
    {
        name: "User Management",
        route: ROUTES.USER_MANAGEMENT,
        icon: <Users className="h-4 w-4" />,
        visible: perms.canManageUsers || perms.canReadUsers,
    },
];