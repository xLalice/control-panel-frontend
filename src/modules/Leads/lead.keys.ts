export const leadKeys = {
  all: ["leads"] as const,
  lists: () => [...leadKeys.all, "list"] as const,
  list: (filters?: any) => [...leadKeys.lists(), { ...filters }] as const,
  details: () => [...leadKeys.all, "detail"] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
  activities: (id: string) => [...leadKeys.detail(id), "activities"] as const,
  companies: ["companies"] as const,
};