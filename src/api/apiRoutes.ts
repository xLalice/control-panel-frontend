export const API_ROUTES = {
  QUOTES: {
    ROOT: "/quotes",
    DETAIL: (id: string | number) => `/quotes/${id}`,
    SEND: (id: string | number) => `/quotes/${id}/send`,
    PDF: (id: string | number) => `/quotes/${id}/pdf`,
  },
  SALES_ORDER: {
    ROOT: "/sales_order",
  }
} as const;

export type QuotesRoute = keyof typeof API_ROUTES.QUOTES;
