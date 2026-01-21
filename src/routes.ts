export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    USER_MANAGEMENT: "/user-management",
    LEADS: "/leads",
    LEAD_DETAIL: (id: string | number) => `/leads/${id}`,
    REPORTS: "/reports",
    PRODUCTS: "/products",
    INQUIRIES: "/inquiries",
    DOCUMENTS: "/documents",
    ATTENDANCE: "/attendance",
    ADMIN_ATTENDANCE: "/attendance/admin",
    CLIENTS: "/clients",
    QUOTES: "/quotes",
    QUOTE_DETAIL: (id: string | number) => `/quotes/${id}`,
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey] extends (...args: any) => string
  ? string
  : typeof ROUTES[RouteKey];