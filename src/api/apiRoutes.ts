export const API_ROUTES = {
  QUOTES: {
    ROOT: "/quotes",
    DETAIL: (id: string | number) => `/quotes/${id}`,
    SEND: (id: string | number) => `/quotes/${id}/send`,
    PDF: (id: string | number) => `/quotes/${id}/pdf`,
    CONVERT: (id: string | number) => `/quotes/${id}/convert`
  },
  SALES_ORDER: {
    ROOT: "/sales-order",
  }
} as const;

export type QuotesRoute = keyof typeof API_ROUTES.QUOTES;
